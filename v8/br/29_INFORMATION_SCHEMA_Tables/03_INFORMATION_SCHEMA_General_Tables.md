## 28.3 Tabelas gerais do esquema de informação

As seções a seguir descrevem o que pode ser denominado como o conjunto “geral” das tabelas `INFORMATION_SCHEMA`. São as tabelas que não estão associadas a motores de armazenamento, componentes ou plugins específicos.

### 28.3.1 Tabela de Referência do Schema de Informação Geral

A tabela a seguir resume as tabelas gerais do `INFORMATION_SCHEMA`. Para mais detalhes, consulte as descrições das tabelas individuais.

**Tabela 28.2 Tabelas gerais do esquema de informações**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA general tables."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Table Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>ADMINISTRABLE_ROLE_AUTHORIZATIONS</code></th> <td>Usuários ou papéis grantables para o usuário ou papel atual</td> <td>8.0.19</td> <td></td> </tr><tr><th scope="row"><code>APPLICABLE_ROLES</code></th> <td>Applicable roles for current user</td> <td>8.0.19</td> <td></td> </tr><tr><th scope="row"><code>CHARACTER_SETS</code></th> <td>Available character sets</td> <td></td> <td></td> </tr><tr><th scope="row"><code>CHECK_CONSTRAINTS</code></th> <td>Table and column CHECK constraints</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row"><code>COLLATION_CHARACTER_SET_APPLICABILITY</code></th> <td>Conjunto de caracteres aplicável a cada combinação de ordenação</td> <td></td> <td></td> </tr><tr><th scope="row"><code>COLLATIONS</code></th> <td>Colagens para cada conjunto de caracteres</td> <td></td> <td></td> </tr><tr><th scope="row"><code>COLUMN_PRIVILEGES</code></th> <td>Privilegios definidos em colunas</td> <td></td> <td></td> </tr><tr><th scope="row"><code>COLUMN_STATISTICS</code></th> <td>Estatísticas de histograma para valores de coluna</td> <td></td> <td></td> </tr><tr><th scope="row"><code>COLUMNS</code></th> <td>Colunas em cada tabela</td> <td></td> <td></td> </tr><tr><th scope="row"><code>COLUMNS_EXTENSIONS</code></th> <td>Atributos da coluna para motores de armazenamento primário e secundário</td> <td>8.0.21</td> <td></td> </tr><tr><th scope="row"><code>ENABLED_ROLES</code></th> <td>Roles enabled within current session</td> <td>8.0.19</td> <td></td> </tr><tr><th scope="row"><code>ENGINES</code></th> <td>Storage engine properties</td> <td></td> <td></td> </tr><tr><th scope="row"><code>EVENTS</code></th> <td>Event Manager events</td> <td></td> <td></td> </tr><tr><th scope="row"><code>FILES</code></th> <td>Arquivos que armazenam dados do espaço de tabela</td> <td></td> <td></td> </tr><tr><th scope="row"><code>KEY_COLUMN_USAGE</code></th> <td>Quais colunas-chave têm restrições</td> <td></td> <td></td> </tr><tr><th scope="row"><code>KEYWORDS</code></th> <td>MySQL keywords</td> <td></td> <td></td> </tr><tr><th scope="row"><code>ndb_transid_mysql_connection_map</code></th> <td>NDB transaction information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>OPTIMIZER_TRACE</code></th> <td>Informações produzidas pela atividade de rastreamento do otimizador</td> <td></td> <td></td> </tr><tr><th scope="row"><code>PARAMETERS</code></th> <td>Parâmetros de rotina armazenados e valores de retorno de função armazenados</td> <td></td> <td></td> </tr><tr><th scope="row"><code>PARTITIONS</code></th> <td>Table partition information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>PLUGINS</code></th> <td>Plugin information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>PROCESSLIST</code></th> <td>Informações sobre os threads atualmente em execução</td> <td></td> <td></td> </tr><tr><th scope="row"><code>PROFILING</code></th> <td>Statement profiling information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>REFERENTIAL_CONSTRAINTS</code></th> <td>Foreign key information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>RESOURCE_GROUPS</code></th> <td>Resource group information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>ROLE_COLUMN_GRANTS</code></th> <td>Privilegios de coluna para papéis disponíveis para ou concedidos por papéis atualmente habilitados</td> <td>8.0.19</td> <td></td> </tr><tr><th scope="row"><code>ROLE_ROUTINE_GRANTS</code></th> <td>Privilegios de rotina para papéis disponíveis para ou concedidos por papéis atualmente habilitados</td> <td>8.0.19</td> <td></td> </tr><tr><th scope="row"><code>ROLE_TABLE_GRANTS</code></th> <td>Privilégios de tabela para papéis disponíveis para ou concedidos por papéis atualmente habilitados</td> <td>8.0.19</td> <td></td> </tr><tr><th scope="row"><code>ROUTINES</code></th> <td>Stored routine information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>SCHEMA_PRIVILEGES</code></th> <td>Privilegios definidos em esquemas</td> <td></td> <td></td> </tr><tr><th scope="row"><code>SCHEMATA</code></th> <td>Schema information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>SCHEMATA_EXTENSIONS</code></th> <td>Schema options</td> <td>8.0.22</td> <td></td> </tr><tr><th scope="row"><code>ST_GEOMETRY_COLUMNS</code></th> <td>Colunas em cada tabela que armazenam dados espaciais</td> <td></td> <td></td> </tr><tr><th scope="row"><code>ST_SPATIAL_REFERENCE_SYSTEMS</code></th> <td>Sistemas de referência espaciais disponíveis</td> <td></td> <td></td> </tr><tr><th scope="row"><code>ST_UNITS_OF_MEASURE</code></th> <td>Acceptable units for ST_Distance()</td> <td>8.0.14</td> <td></td> </tr><tr><th scope="row"><code>STATISTICS</code></th> <td>Table index statistics</td> <td></td> <td></td> </tr><tr><th scope="row"><code>TABLE_CONSTRAINTS</code></th> <td>Quais tabelas têm restrições</td> <td></td> <td></td> </tr><tr><th scope="row"><code>TABLE_CONSTRAINTS_EXTENSIONS</code></th> <td>Atributos de restrição de tabela para motores de armazenamento primário e secundário</td> <td>8.0.21</td> <td></td> </tr><tr><th scope="row"><code>TABLE_PRIVILEGES</code></th> <td>Privilegios definidos em tabelas</td> <td></td> <td></td> </tr><tr><th scope="row"><code>TABLES</code></th> <td>Table information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>TABLES_EXTENSIONS</code></th> <td>Atributos da tabela para motores de armazenamento primário e secundário</td> <td>8.0.21</td> <td></td> </tr><tr><th scope="row"><code>TABLESPACES</code></th> <td>Tablespace information</td> <td></td> <td>8.0.22</td> </tr><tr><th scope="row"><code>TABLESPACES_EXTENSIONS</code></th> <td>Atributos do tablespace para motores de armazenamento primário</td> <td>8.0.21</td> <td></td> </tr><tr><th scope="row"><code>TRIGGERS</code></th> <td>Trigger information</td> <td></td> <td></td> </tr><tr><th scope="row"><code>USER_ATTRIBUTES</code></th> <td>User comments and attributes</td> <td>8.0.21</td> <td></td> </tr><tr><th scope="row"><code>USER_PRIVILEGES</code></th> <td>Privilegios definidos globalmente por usuário</td> <td></td> <td></td> </tr><tr><th scope="row"><code>VIEW_ROUTINE_USAGE</code></th> <td>Stored functions used in views</td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>VIEW_TABLE_USAGE</code></th> <td>Tabelas e visualizações usadas em visualizações</td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>VIEWS</code></th> <td>View information</td> <td></td> <td></td> </tr></tbody></table>

### 28.3.2 A tabela INFORMATION_SCHEMA ADMINISTRABLE_ROLE_AUTHORIZATIONS

A tabela `ADMINISTRABLE_ROLE_AUTHORIZATIONS` (disponível a partir do MySQL 8.0.19) fornece informações sobre quais papéis aplicáveis ao usuário ou papel atual podem ser concedidos a outros usuários ou papéis.

A tabela `ADMINISTRABLE_ROLE_AUTHORIZATIONS` tem essas colunas:

* `USER`

A parte do nome de usuário da conta de usuário atual.

* `HOST`

A parte do nome de host da conta de usuário atual.

* `GRANTEE`

A parte do nome de usuário da conta à qual o papel é concedido.

* `GRANTEE_HOST`

A parte do nome de host da conta à qual o papel é concedido.

* `ROLE_NAME`

A parte do nome de usuário do papel concedido.

* `ROLE_HOST`

A parte do nome de host do papel concedido.

* `IS_GRANTABLE`

`YES` ou `NO`, dependendo se o papel é concedível a outras contas.

* `IS_DEFAULT`

`YES` ou `NO`, dependendo se o papel é um papel padrão.

* `IS_MANDATORY`

`YES` ou `NO`, dependendo se o papel é obrigatório.

### 28.3.3 A tabela INFORMATION_SCHEMA APPLICABLE_ROLES
### 28.3.4 A tabela INFORMATION_SCHEMA SCHEMATA
### 28.3.5 A tabela INFORMATION_SCHEMA SCHEMA
### 28.3.6 A tabela INFORMATION_SCHEMA SCHEMA_USAGE
### 28.3.7 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_ROLE
### 28.3.8 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_RELATIONSHIP
### 28.3.9 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA
### 28.3.10 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA_ROLE
### 28.3.11 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA_USAGE
### 28.3.12 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA_USAGE_ROLE
### 28.3.13 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA_USAGE_SCHEMA
### 28.3.14 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA_USAGE_SCHEMA_ROLE

A tabela `APPLICABLE_ROLES` (disponível a partir do MySQL 8.0.19) fornece informações sobre os papéis aplicáveis para o usuário atual.

A tabela `APPLICABLE_ROLES` tem essas colunas:

* `USER`

A parte do nome de usuário da conta de usuário atual.

* `HOST`

A parte do nome de host da conta de usuário atual.

* `GRANTEE`

A parte do nome de usuário da conta à qual o papel é concedido.

* `GRANTEE_HOST`

A parte do nome de host da conta à qual o papel é concedido.

* `ROLE_NAME`

A parte do nome de usuário do papel concedido.

* `ROLE_HOST`

A parte do nome de host do papel concedido.

* `IS_GRANTABLE`

`YES` ou `NO`, dependendo se o papel é concedível a outras contas.

* `IS_DEFAULT`

`YES` ou `NO`, dependendo se o papel é um papel padrão.

* `IS_MANDATORY`

`YES` ou `NO`, dependendo se o papel é obrigatório.

### 28.3.4 A tabela INFORMATION_SCHEMA CHARACTER_SETS

A tabela `CHARACTER_SETS` fornece informações sobre os conjuntos de caracteres disponíveis.

A tabela `CHARACTER_SETS` tem essas colunas:

* `CHARACTER_SET_NAME`

O nome do conjunto de caracteres.

* `DEFAULT_COLLATE_NAME`

A agregação padrão para o conjunto de caracteres.

* `DESCRIPTION`

Uma descrição do conjunto de caracteres.

* `MAXLEN`

O número máximo de bytes necessários para armazenar um caractere.

#### Notas

As informações sobre o conjunto de caracteres também estão disponíveis na declaração `SHOW CHARACTER SET`. Veja a Seção 15.7.7.3, “Declaração SHOW CHARACTER SET”. As seguintes declarações são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.CHARACTER_SETS
  [WHERE CHARACTER_SET_NAME LIKE 'wild']

SHOW CHARACTER SET
  [LIKE 'wild']
```

### 28.3.5 A tabela INFORMATION_SCHEMA CHECK_CONSTRAINTS

A partir do MySQL 8.0.16, `CREATE TABLE` permite as características principais das restrições de tabela e coluna `CHECK`, e a tabela `CHECK_CONSTRAINTS` fornece informações sobre essas restrições.

A tabela `CHECK_CONSTRAINTS` tem essas colunas:

* `CONSTRAINT_CATALOG`

O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

O nome da restrição.

* `CHECK_CLAUSE`

A expressão que especifica a condição de restrição.

### 28.3.6 A tabela INFORMATION_SCHEMA COLLATIONS

A tabela `COLLATIONS` fornece informações sobre as codificações para cada conjunto de caracteres.

A tabela `COLLATIONS` tem essas colunas:

* `COLLATION_NAME`

O nome da agregação.

* `CHARACTER_SET_NAME`

O nome do conjunto de caracteres com o qual a correção está associada.

* `ID`

O ID de agregação.

* `IS_DEFAULT`

Se a ordenação é a padrão para seu conjunto de caracteres.

* `IS_COMPILED`

Se o conjunto de caracteres é compilado no servidor.

* `SORTLEN`

Isso está relacionado à quantidade de memória necessária para ordenar strings expressas no conjunto de caracteres.

* `PAD_ATTRIBUTE`

O atributo de bloco de cotação, seja `NO PAD` ou `PAD SPACE`. Este atributo afeta se espaços finais são significativos em comparações de string; veja Tratamento de Espaço Final em Comparações.

#### Notas

Informações sobre cotação também estão disponíveis na declaração `SHOW COLLATION`. Veja a Seção 15.7.7.4, “Declaração SHOW COLLATION”. As seguintes declarações são equivalentes:

```
SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS
  [WHERE COLLATION_NAME LIKE 'wild']

SHOW COLLATION
  [LIKE 'wild']
```

### 28.3.7 A tabela INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY

A tabela `COLLATION_CHARACTER_SET_APPLICABILITY` indica qual conjunto de caracteres é aplicável para qual ordenação.

A tabela `COLLATION_CHARACTER_SET_APPLICABILITY` tem essas colunas:

* `COLLATION_NAME`

O nome da agregação.

* `CHARACTER_SET_NAME`

O nome do conjunto de caracteres com o qual a correção está associada.

#### Notas

As colunas `COLLATION_CHARACTER_SET_APPLICABILITY` são equivalentes às duas primeiras colunas exibidas pela declaração `SHOW COLLATION`.

### 28.3.8 A tabela INFORMATION_SCHEMA COLUMNS

A tabela `COLUMNS` fornece informações sobre as colunas das tabelas. A tabela relacionada `ST_GEOMETRY_COLUMNS` fornece informações sobre as colunas da tabela que armazenam dados espaciais. Veja a Seção 28.3.35, “A tabela INFORMATION_SCHEMA ST_GEOMETRY_COLUMNS”.

A tabela `COLUMNS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela que contém a coluna pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

* `TABLE_NAME`

O nome da tabela que contém a coluna.

* `COLUMN_NAME`

O nome da coluna.

* `ORDINAL_POSITION`

A posição da coluna na tabela. `ORDINAL_POSITION` é necessária porque você pode querer dizer `ORDER BY ORDINAL_POSITION`. Ao contrário de [`SHOW COLUMNS`(show-columns.html "15.7.7.5 SHOW COLUMNS Statement"), o `SELECT` da tabela `COLUMNS` não tem ordenação automática.

* `COLUMN_DEFAULT`

O valor padrão da coluna. Este é `NULL` se a coluna tiver um valor padrão explícito de `NULL`, ou se a definição da coluna não incluir nenhuma cláusula de `DEFAULT`.

* `IS_NULLABLE`

A coluna nulidade. O valor é `YES` se os valores de `NULL` puderem ser armazenados na coluna, `NO` se não puderem.

* `DATA_TYPE`

O tipo de dados da coluna.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `COLUMN_TYPE` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `CHARACTER_MAXIMUM_LENGTH`

Para colunas de texto, o comprimento máximo em caracteres.

* `CHARACTER_OCTET_LENGTH`

Para colunas de texto, o comprimento máximo em bytes.

* `NUMERIC_PRECISION`

Para colunas numéricas, a precisão numérica.

* `NUMERIC_SCALE`

Para colunas numéricas, a escala numérica.

* `DATETIME_PRECISION`

Para colunas temporais, a precisão de segundos fracionários.

* `CHARACTER_SET_NAME`

Para colunas de cadeia de caracteres, o nome do conjunto de caracteres.

* `COLLATION_NAME`

Para colunas de cadeia de caracteres, o nome da correção.

* `COLUMN_TYPE`

O tipo de dados da coluna.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `COLUMN_TYPE` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `COLUMN_KEY`

Se a coluna está indexada:

+ Se `COLUMN_KEY` estiver vazio, a coluna não está indexada ou está indexada apenas como uma coluna secundária em um índice de múltiplas colunas, não exclusivo.

+ Se `COLUMN_KEY` for `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas de uma `PRIMARY KEY` de múltiplas colunas.

+ Se `COLUMN_KEY` é `UNI`, a coluna é a primeira coluna de um índice `UNIQUE`. (Um índice `UNIQUE` permite múltiplos valores de `NULL`, mas você pode determinar se a coluna permite `NULL` verificando a coluna `Null`.

+ Se `COLUMN_KEY` for `MUL`, a coluna é a primeira coluna de um índice não único, na qual múltiplas ocorrências de um valor dado são permitidas na coluna.

Se mais de um dos valores de `COLUMN_KEY` se aplica a uma coluna específica de uma tabela, o `COLUMN_KEY` exibe o valor com a maior prioridade, na ordem `PRI`, `UNI`, `MUL`.

Um índice `UNIQUE` pode ser exibido como `PRI` se ele não puder conter valores `NULL` e não houver `PRIMARY KEY` na tabela. Um índice `UNIQUE` pode ser exibido como `MUL` se várias colunas formarem um índice composto `UNIQUE`; embora a combinação das colunas seja única, cada coluna ainda pode conter múltiplas ocorrências de um valor dado.

* `EXTRA`

Qualquer informação adicional disponível sobre uma coluna específica. O valor não está vazio nestes casos:

+ `auto_increment` para colunas que possuem o atributo `AUTO_INCREMENT`.

+ `on update CURRENT_TIMESTAMP` para as colunas `TIMESTAMP` ou `DATETIME` que possuem o atributo `ON UPDATE CURRENT_TIMESTAMP`.

+ `STORED GENERATED` ou `VIRTUAL GENERATED` para colunas geradas.

+ `DEFAULT_GENERATED` para colunas que têm um valor padrão de expressão.

* `PRIVILEGES`

Os privilégios que você tem para a coluna.

* `COLUMN_COMMENT`

Qualquer comentário incluído na definição da coluna.

* `GENERATION_EXPRESSION`

Para colunas geradas, exibe a expressão usada para calcular os valores das colunas. Vazia para colunas não geradas. Para informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

* `SRS_ID`

Este valor se aplica a colunas espaciais. Ele contém o valor da coluna `SRID` que indica o sistema de referência espacial para os valores armazenados na coluna. Veja a Seção 13.4.1, “Tipos de Dados Espaciais”, e a Seção 13.4.5, “Suporte ao Sistema de Referência Espacial”. O valor é `NULL` para colunas não espaciais e colunas espaciais sem o atributo `SRID`.

#### Notas

* Em `SHOW COLUMNS`, o `Type` display inclui valores de várias colunas diferentes do `COLUMNS`.

* `CHARACTER_OCTET_LENGTH` deve ser o mesmo que `CHARACTER_MAXIMUM_LENGTH`, exceto para conjuntos de caracteres multibyte.

* `CHARACTER_SET_NAME` pode ser derivado de `COLLATION_NAME`. Por exemplo, se você digitar `SHOW FULL COLUMNS FROM t`, e você vê na coluna `COLLATION_NAME` um valor de `utf8mb4_swedish_ci`, o conjunto de caracteres é o que aparece antes do primeiro underscore: `utf8mb4`.

As informações da coluna também estão disponíveis na declaração `SHOW COLUMNS`. Veja a Seção 15.7.7.5, “Declaração SHOW COLUMNS”. As seguintes declarações são quase equivalentes:

```
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE table_name = 'tbl_name'
  [AND table_schema = 'db_name']
  [AND column_name LIKE 'wild']

SHOW COLUMNS
  FROM tbl_name
  [FROM db_name]
  [LIKE 'wild']
```

Em MySQL 8.0.30 e versões posteriores, as informações sobre as colunas primárias invisíveis geradas são visíveis por padrão nesta tabela. Você pode ocultar essas informações definindo `show_gipk_in_create_table_and_information_schema = OFF`(server-system-variables.html#sysvar_show_gipk_in_create_table_and_information_schema). Para mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.

### 28.3.9 A tabela INFORMATION_SCHEMA COLUMNS_EXTENSIONS

A tabela `COLUMNS_EXTENSIONS` (disponível a partir do MySQL 8.0.21) fornece informações sobre os atributos dos colunas definidos para motores de armazenamento primário e secundário.

Nota

A tabela `COLUMNS_EXTENSIONS` é reservada para uso futuro.

A tabela `COLUMNS_EXTENSIONS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela.

* `COLUMN_NAME`

O nome da coluna.

* `ENGINE_ATTRIBUTE`

Atributos da coluna definidos para o motor de armazenamento primário. Reservado para uso futuro.

* `SECONDARY_ENGINE_ATTRIBUTE`

Atributos de coluna definidos para o motor de armazenamento secundário. Reservado para uso futuro.

### 28.3.10 A tabela INFORMATION_SCHEMA COLUMN_PRIVILEGES

A tabela `COLUMN_PRIVILEGES` fornece informações sobre privilégios de coluna. Ela obtém seus valores da tabela do sistema `mysql.columns_priv`.

A tabela `COLUMN_PRIVILEGES` tem essas colunas:

* `GRANTEE`

O nome da conta à qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela que contém a coluna pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

* `TABLE_NAME`

O nome da tabela que contém a coluna.

* `COLUMN_NAME`

O nome da coluna.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da coluna; veja a Seção 15.7.1.6, "Declaração GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio da coluna detido pelo beneficiário.

Na saída de `SHOW FULL COLUMNS`(show-columns.html "15.7.7.5 SHOW COLUMNS Statement"), os privilégios estão em uma única coluna e em minúsculas, por exemplo, `select,insert,update,references`. Em `COLUMN_PRIVILEGES`, há um privilégio por linha, em maiúsculas.

* `IS_GRANTABLE`

`YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `COLUMN_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```
SELECT ... FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES

SHOW GRANTS ...
```

### 28.3.11 A tabela INFORMATION_SCHEMA COLUMN_STATISTICS

A tabela `COLUMN_STATISTICS` fornece acesso a estatísticas de histograma para os valores da coluna.

Para informações sobre estatísticas de histogramas, consulte a Seção 10.9.6, “Estatísticas do otimizador”, e a Seção 15.7.3.1, “Declaração de Tabela ANALYZE”.

Você pode ver informações apenas para as colunas para as quais você tem algum privilégio.

A tabela `COLUMN_STATISTICS` tem essas colunas:

* `SCHEMA_NAME`

Os nomes do esquema para o qual as estatísticas se aplicam.

* `TABLE_NAME`

Os nomes das colunas para as quais as estatísticas se aplicam.

* `COLUMN_NAME`

Os nomes das colunas para as quais as estatísticas se aplicam.

* `HISTOGRAM`

Um objeto `JSON` que descreve as estatísticas da coluna, armazenado como um histograma.

### 28.3.12 A tabela INFORMATION_SCHEMA ENABLED_ROLES

A tabela `ENABLED_ROLES` (disponível a partir do MySQL 8.0.19) fornece informações sobre os papéis que estão habilitados na sessão atual.

A tabela `ENABLED_ROLES` tem essas colunas:

* `ROLE_NAME`

A parte do nome de usuário do papel concedido.

* `ROLE_HOST`

A parte do nome de host do papel concedido.

* `IS_DEFAULT`

`YES` ou `NO`, dependendo se o papel é um papel padrão.

* `IS_MANDATORY`

`YES` ou `NO`, dependendo se o papel é obrigatório.

### 28.3.13 A Tabela INFORMATION_SCHEMA ENGINES

A tabela `ENGINES` fornece informações sobre os motores de armazenamento. Isso é particularmente útil para verificar se um motor de armazenamento é suportado ou para ver qual é o motor padrão.

A tabela `ENGINES` tem essas colunas:

* `ENGINE`

O nome do motor de armazenamento.

* `SUPPORT`

O nível de suporte do servidor para o motor de armazenamento, conforme mostrado na tabela a seguir.

  <table summary="Values for the SUPPORT column in the INFORMATION_SCHEMA.ENGINES table."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>YES</code></td> <td>O motor é suportado e está ativo</td> </tr><tr> <td><code>DEFAULT</code></td> <td>Como<code>YES</code>, além disso, este é o motor padrão</td> </tr><tr> <td><code>NO</code></td> <td>O motor não é suportado</td> </tr><tr> <td><code>DISABLED</code></td> <td>O motor é suportado, mas foi desativado</td> </tr></tbody></table>

Um valor de `NO` significa que o servidor foi compilado sem suporte para o motor, portanto, não pode ser habilitado em tempo de execução.

Um valor de `DISABLED` ocorre porque o servidor foi iniciado com uma opção que desativa o motor, ou porque não foram fornecidas todas as opções necessárias para ativá-lo. No último caso, o log de erro deve conter um motivo que indique por que a opção está desativada. Veja a Seção 7.4.2, “O Log de Erro”.

Você também pode ver `DISABLED` para um motor de armazenamento se o servidor foi compilado para o suporte, mas foi iniciado com uma opção `--skip-engine_name`. Para o motor de armazenamento `NDB`, `DISABLED` significa que o servidor foi compilado com suporte para NDB Cluster, mas não foi iniciado com a opção `--ndbcluster`.

Todos os servidores MySQL suportam as tabelas `MyISAM`. Não é possível desabilitar `MyISAM`.

* `COMMENT`

Uma breve descrição do motor de armazenamento.

* `TRANSACTIONS`

Se o motor de armazenamento suporta transações.

* `XA`

Se o motor de armazenamento suporta transações XA.

* `SAVEPOINTS`

Se o motor de armazenamento suporta pontos de salvamento.

#### Notas

* `ENGINES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As informações do motor de armazenamento também estão disponíveis na declaração `SHOW ENGINES`. Veja a Seção 15.7.7.16, “Declaração SHOW ENGINES”. As seguintes declarações são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.ENGINES

SHOW ENGINES
```

### 28.3.14 A tabela INFORMATION_SCHEMA EVENTS

A tabela `EVENTS` fornece informações sobre os eventos do Gerenciador de Eventos, que são discutidos na Seção 27.4, “Usando o Cronograma de Eventos”.

A tabela `EVENTS` tem essas colunas:

* `EVENT_CATALOG`

O nome do catálogo ao qual o evento pertence. Esse valor é sempre `def`.

* `EVENT_SCHEMA`

O nome do esquema (banco de dados) ao qual o evento pertence.

* `EVENT_NAME`

O nome do evento.

* `DEFINER`

A conta nomeada na cláusula `DEFINER` (frequentemente o usuário que criou o evento), no formato `'user_name'@'host_name'`.

* `TIME_ZONE`

O fuso horário do evento, que é o fuso horário usado para agendar o evento e que está em vigor dentro do evento conforme ele é executado. O valor padrão é `SYSTEM`.

* `EVENT_BODY`

A linguagem utilizada para as declarações na cláusula `DO` do evento. O valor é sempre `SQL`.

* `EVENT_DEFINITION`

O texto da declaração SQL que compõe a cláusula `DO` do evento; em outras palavras, a declaração executada por este evento.

* `EVENT_TYPE`

O tipo de repetição do evento, seja `ONE TIME` (transitória) ou `RECURRING` (repetitiva).

* `EXECUTE_AT`

Para um evento único, esse é o valor `DATETIME` especificado na cláusula `AT` da declaração `CREATE EVENT` usada para criar o evento, ou da última declaração [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement") que modificou o evento. O valor mostrado nesta coluna reflete a adição ou subtração de qualquer valor `INTERVAL` incluído na cláusula `AT` do evento. Por exemplo, se um evento é criado usando `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, e o evento foi criado em 2018-02-09 14:05:30, o valor mostrado nesta coluna seria `'2018-02-10 20:05:30'`. Se o cronograma do evento é determinado por uma cláusula `EVERY` em vez de uma cláusula `AT` (ou seja, se o evento é recorrente), o valor desta coluna é `NULL`.

* `INTERVAL_VALUE`

Para um evento recorrente, o número de intervalos a serem esperados entre as execuções do evento. Para um evento transitório, o valor é sempre `NULL`.

* `INTERVAL_FIELD`

As unidades de tempo usadas para o intervalo que um evento recorrente espera antes de se repetir. Para um evento transitório, o valor é sempre `NULL`.

* `SQL_MODE`

O modo SQL em vigor quando o evento foi criado ou alterado, e sob o qual o evento é executado. Para os valores permitidos, consulte a Seção 7.1.11, “Modos SQL do servidor”.

* `STARTS`

A data e a hora de início de um evento periódico. Isso é exibido como um valor `DATETIME`, e é `NULL` se não houver data e hora de início definidos para o evento. Para um evento transitório, esta coluna é sempre `NULL`. Para um evento periódico cuja definição inclui uma cláusula `STARTS`, esta coluna contém o valor correspondente `DATETIME`. Assim como a coluna `EXECUTE_AT`, esse valor resolve quaisquer expressões usadas. Se não houver cláusula `STARTS` afetando o cronograma do evento, esta coluna é `NULL`

* `ENDS`

Para um evento recorrente cuja definição inclui uma cláusula `ENDS`, esta coluna contém o valor correspondente `DATETIME`. Como no caso da coluna `EXECUTE_AT`, este valor resolve quaisquer expressões utilizadas. Se não houver nenhuma cláusula `ENDS` que afete o momento do evento, esta coluna é `NULL`.

* `STATUS`

O status do evento. Um dos `ENABLED`, `DISABLED` ou `SLAVESIDE_DISABLED`. `SLAVESIDE_DISABLED` indica que a criação do evento ocorreu em outro servidor MySQL que atua como fonte de replicação e foi replicado para o servidor MySQL atual que está atuando como replica, mas o evento não está sendo executado atualmente na replica. Para mais informações, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

* `ON_COMPLETION`

Um dos dois valores `PRESERVE` ou `NOT PRESERVE`.

* `CREATED`

A data e a hora em que o evento foi criado. Este é um valor `TIMESTAMP`.

* `LAST_ALTERED`

A data e a hora em que o evento foi modificado pela última vez. Este é um valor `TIMESTAMP`. Se o evento não foi modificado desde sua criação, este valor é o mesmo que o valor [[`CREATED`].

* `LAST_EXECUTED`

A data e a hora em que o evento foi executado pela última vez. Este é um valor `DATETIME`. Se o evento nunca tiver sido executado, esta coluna é `NULL`.

`LAST_EXECUTED` indica quando o evento começou. Como resultado, a coluna `ENDS` nunca é menor que `LAST_EXECUTED`.

* `EVENT_COMMENT`

O texto do comentário, se o evento tiver um. Se não, este valor está vazio.

* `ORIGINATOR`

O ID do servidor do MySQL no qual o evento foi criado; utilizado na replicação. Este valor pode ser atualizado por `ALTER EVENT` para o ID do servidor no qual essa declaração ocorre, se executada em uma fonte de replicação. O valor padrão é 0.

* `CHARACTER_SET_CLIENT`

O valor da sessão da variável de sistema `character_set_client` quando o evento foi criado.

* `COLLATION_CONNECTION`

O valor da sessão da variável de sistema `collation_connection` quando o evento foi criado.

* `DATABASE_COLLATION`

A agregação do banco de dados com o qual o evento está associado.

#### Notas

* `EVENTS` é uma tabela não padrão `INFORMATION_SCHEMA`.

* Os horários da tabela `EVENTS` são exibidos usando o fuso horário do evento, o fuso horário da sessão atual ou UTC, conforme descrito na Seção 27.4.4, “Metadados do evento”.

* Para mais informações sobre `SLAVESIDE_DISABLED` e a coluna `ORIGINATOR`, consulte a Seção 19.5.1.16, “Replicação de Características Invocadas”.

#### Exemplo

Suponha que o usuário `'jon'@'ghidora'` crie um evento chamado `e_daily`, e depois o modifique alguns minutos depois usando uma declaração `ALTER EVENT`(alter-event.html "15.1.3 ALTER EVENT Statement"), como mostrado aqui:

```
DELIMITER |

CREATE EVENT e_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Saves total number of sessions then clears the table each day'
    DO
      BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END |

DELIMITER ;

ALTER EVENT e_daily
    ENABLE;
```

(Observe que os comentários podem ocupar várias linhas.)

Esse usuário pode, então, executar a seguinte declaração `SELECT`, e obter a saída mostrada:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.EVENTS
       WHERE EVENT_NAME = 'e_daily'
       AND EVENT_SCHEMA = 'myschema'\G
*************************** 1. row ***************************
       EVENT_CATALOG: def
        EVENT_SCHEMA: myschema
          EVENT_NAME: e_daily
             DEFINER: jon@ghidora
           TIME_ZONE: SYSTEM
          EVENT_BODY: SQL
    EVENT_DEFINITION: BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END
          EVENT_TYPE: RECURRING
          EXECUTE_AT: NULL
      INTERVAL_VALUE: 1
      INTERVAL_FIELD: DAY
            SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_ENGINE_SUBSTITUTION
              STARTS: 2018-08-08 11:06:34
                ENDS: NULL
              STATUS: ENABLED
       ON_COMPLETION: NOT PRESERVE
             CREATED: 2018-08-08 11:06:34
        LAST_ALTERED: 2018-08-08 11:06:34
       LAST_EXECUTED: 2018-08-08 16:06:34
       EVENT_COMMENT: Saves total number of sessions then clears the
                      table each day
          ORIGINATOR: 1
CHARACTER_SET_CLIENT: utf8mb4
COLLATION_CONNECTION: utf8mb4_0900_ai_ci
  DATABASE_COLLATION: utf8mb4_0900_ai_ci
```

As informações sobre o evento também estão disponíveis na declaração `SHOW EVENTS`. Veja a Seção 15.7.7.18, “Declaração SHOW EVENTS”. As seguintes declarações são equivalentes:

```
SELECT
    EVENT_SCHEMA, EVENT_NAME, DEFINER, TIME_ZONE, EVENT_TYPE, EXECUTE_AT,
    INTERVAL_VALUE, INTERVAL_FIELD, STARTS, ENDS, STATUS, ORIGINATOR,
    CHARACTER_SET_CLIENT, COLLATION_CONNECTION, DATABASE_COLLATION
  FROM INFORMATION_SCHEMA.EVENTS
  WHERE table_schema = 'db_name'
  [AND column_name LIKE 'wild']

SHOW EVENTS
  [FROM db_name]
  [LIKE 'wild']
```

### 28.3.15 A Tabela INFORMATION_SCHEMA FILES

A tabela `FILES` fornece informações sobre os arquivos nos quais os dados do espaço de tabela do MySQL são armazenados.

A tabela `FILES` fornece informações sobre os arquivos de dados `InnoDB`. No NDB Cluster, essa tabela também fornece informações sobre os arquivos nos quais as tabelas de Dados de Disco do NDB Cluster são armazenadas. Para informações adicionais específicas de `InnoDB`, consulte as Notas do InnoDB, mais adiante nesta seção; para informações adicionais específicas do NDB Cluster, consulte as Notas do NDB.

A tabela `FILES` tem essas colunas:

* `FILE_ID`

Para `InnoDB`: O ID do tablespace, também referido como o `space_id` ou `fil_space_t::id`.

Para `NDB`: Um identificador de arquivo. Os valores da coluna `FILE_ID` são gerados automaticamente.

* `FILE_NAME`

Para `InnoDB`: O nome do arquivo de dados. Os espaços de tabela por arquivo e espaços de tabela gerais têm uma extensão de nome de arquivo `.ibd`. Os espaços de tabelas de desfazer são prefixados por `undo`. O espaço de tabela do sistema é prefixado por `ibdata`. O espaço de tabela temporário global é prefixado por `ibtmp`. O nome do arquivo inclui o caminho do arquivo, que pode ser relativo ao diretório de dados do MySQL (o valor da variável do sistema `datadir`).

Para `NDB`: O nome de um arquivo de registro de desfazer criado por `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`, ou de um arquivo de dados criado por (create-tablespace.html "15.1.21 CREATE TABLESPACE Statement") ou [`ALTER TABLESPACE`](alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement"). No NDB 8.0, o nome do arquivo é mostrado com um caminho relativo; para um arquivo de registro de desfazer, este caminho é relativo ao diretório `DataDir/ndb_NodeId_fs/LG`; para um arquivo de dados, é relativo ao diretório `DataDir/ndb_NodeId_fs/TS`. Isso significa, por exemplo, que o nome de um arquivo de dados criado com `ALTER TABLESPACE ts ADD DATAFILE 'data_2.dat' INITIAL SIZE 256M` é mostrado como `./data_2.dat`.

* `FILE_TYPE`

Para `InnoDB`: O tipo de arquivo do tablespace. Existem três tipos de arquivo possíveis para os arquivos `InnoDB`. `TABLESPACE` é o tipo de arquivo para qualquer tablespace de sistema, geral ou por arquivo, que contém tabelas, índices ou outras formas de dados do usuário. `TEMPORARY` é o tipo de arquivo para tablespaces temporários. `UNDO LOG` é o tipo de arquivo para tablespaces de desfazer, que contêm registros de desfazer.

Para `NDB`: Um dos valores `UNDO LOG` ou `DATAFILE`. Antes do NDB 8.0.13, `TABLESPACE` também era um valor possível.

* `TABLESPACE_NAME`

O nome do tablespace com o qual o arquivo está associado.

Para `InnoDB`: Os nomes dos espaços de tabela gerais são especificados quando criados. Os nomes dos espaços de tabela por arquivo são mostrados no seguinte formato: `schema_name/table_name`. O nome do espaço de tabela do sistema `InnoDB` é `innodb_system`. O nome do espaço de tabela temporário global é `innodb_temporary`. Os nomes dos espaços de desfazer predefinidos são `innodb_undo_001` e `innodb_undo_002`. Os nomes dos espaços de desfazer criados pelo usuário são especificados quando criados.

* `TABLE_CATALOG`

Esse valor sempre está vazio.

* `TABLE_SCHEMA`

Isso é sempre `NULL`.

* `TABLE_NAME`

Isso é sempre `NULL`.

* `LOGFILE_GROUP_NAME`

Para `InnoDB`: Isso é sempre `NULL`.

Para `NDB`: O nome do grupo de arquivos de registro ao qual o arquivo de registro ou arquivo de dados pertence.

* `LOGFILE_GROUP_NUMBER`

Para `InnoDB`: Isso é sempre `NULL`.

Para o arquivo de registro de desfazer de dados de disco, o número de identificação autogerado do grupo de arquivos de registro ao qual o arquivo de registro pertence. Isso é o mesmo valor mostrado para a coluna `id` na tabela `ndbinfo.dict_obj_info` e a coluna `log_id` nas tabelas `ndbinfo.logspaces` e `ndbinfo.logspaces` para este arquivo de registro de desfazer.

* `ENGINE`

Para `InnoDB`: Este valor é sempre `InnoDB`.

Para `NDB`: Este valor é sempre `ndbcluster`.

* `FULLTEXT_KEYS`

Isso é sempre `NULL`.

* `DELETED_ROWS`

Isso é sempre `NULL`.

* `UPDATE_COUNT`

Isso é sempre `NULL`.

* `FREE_EXTENTS`

Para `InnoDB`: O número de extensões totalmente livres no arquivo de dados atual.

Para `NDB`: O número de extensões que ainda não foram usadas pelo arquivo.

* `TOTAL_EXTENTS`

Para `InnoDB`: O número de extensões completas usadas no arquivo de dados atual. Qualquer extensão parcial no final do arquivo não é contada.

Para `NDB`: O número total de extensões alocadas para o arquivo.

* `EXTENT_SIZE`

Para `InnoDB`: O tamanho do intervalo é de 1048576 (1 MB) para arquivos com tamanho de página de 4 KB, 8 KB ou 16 KB. O tamanho do intervalo é de 2097152 bytes (2 MB) para arquivos com tamanho de página de 32 KB e 4194304 (4 MB) para arquivos com tamanho de página de 64 KB. `FILES` não reporta o tamanho de página `InnoDB`. O tamanho da página é definido pela variável de sistema `innodb_page_size`. As informações sobre o tamanho do intervalo também podem ser recuperadas da tabela `INNODB_TABLESPACES`, onde `FILES.FILE_ID = INNODB_TABLESPACES.SPACE`.

Para `NDB`: O tamanho de uma extensão do arquivo em bytes.

* `INITIAL_SIZE`

Para `InnoDB`: O tamanho inicial do arquivo em bytes.

Para `NDB`: O tamanho do arquivo em bytes. Este é o mesmo valor que foi usado na cláusula `INITIAL_SIZE` da declaração `CREATE LOGFILE GROUP`, `ALTER LOGFILE GROUP`, `CREATE TABLESPACE` ou `ALTER TABLESPACE` usada para criar o arquivo.

* `MAXIMUM_SIZE`

Para `InnoDB`: O número máximo de bytes permitido no arquivo. O valor é `NULL` para todos os arquivos de dados, exceto os arquivos de dados de espaço de tabela de sistema predefinido. O tamanho máximo do arquivo de espaço de tabela de sistema é definido por `innodb_data_file_path`. O tamanho máximo do arquivo de espaço de tabela temporário global é definido por `innodb_temp_data_file_path`. Um valor `NULL` para um arquivo de dados de espaço de tabela de sistema predefinido indica que um limite de tamanho de arquivo não foi definido explicitamente.

Para `NDB`: Esse valor é sempre o mesmo que o valor de `INITIAL_SIZE`.

* `AUTOEXTEND_SIZE`

O tamanho automático de expansão do espaço de tabela. Para `NDB`, `AUTOEXTEND_SIZE` é sempre `NULL`.

* `CREATION_TIME`

Isso é sempre `NULL`.

* `LAST_UPDATE_TIME`

Isso é sempre `NULL`.

* `LAST_ACCESS_TIME`

Isso é sempre `NULL`.

* `RECOVER_TIME`

Isso é sempre `NULL`.

* `TRANSACTION_COUNTER`

Isso é sempre `NULL`.

* `VERSION`

Para `InnoDB`: Isso é sempre `NULL`.

Para `NDB`: O número da versão do arquivo.

* `ROW_FORMAT`

Para `InnoDB`: Isso é sempre `NULL`.

Para `NDB`: Um dos `FIXED` ou `DYNAMIC`.

* `TABLE_ROWS`

Isso é sempre `NULL`.

* `AVG_ROW_LENGTH`

Isso é sempre `NULL`.

* `DATA_LENGTH`

Isso é sempre `NULL`.

* `MAX_DATA_LENGTH`

Isso é sempre `NULL`.

* `INDEX_LENGTH`

Isso é sempre `NULL`.

* `DATA_FREE`

Para `InnoDB`: O valor total do espaço livre (em bytes) para todo o espaço de tabelas. Os espaços de tabelas de sistema predefinidos, que incluem o espaço de tabelas de sistema e os espaços de tabelas temporárias, podem ter um ou mais arquivos de dados.

Para `NDB`: Isso é sempre `NULL`.

* `CREATE_TIME`

Isso é sempre `NULL`.

* `UPDATE_TIME`

Isso é sempre `NULL`.

* `CHECK_TIME`

Isso é sempre `NULL`.

* `CHECKSUM`

Isso é sempre `NULL`.

* `STATUS`

Para `InnoDB`: Este valor é `NORMAL` por padrão. Os espaços de tabela por tabela `InnoDB` podem relatar `IMPORTING`, o que indica que o espaço de tabela ainda não está disponível.

Para `NDB`: Para arquivos de dados de disco do NDB Cluster, esse valor é sempre `NORMAL`.

* `EXTRA`

Para `InnoDB`: Isso é sempre `NULL`.

Para `NDB`: (*NDB 8.0.15 e versões posteriores*) Para arquivos de registro de desfazer, esta coluna mostra o tamanho do buffer de registro de desfazer; para arquivos de dados, ele é sempre *NULL*. Uma explicação mais detalhada é fornecida nos próximos parágrafos.

`NDBCLUSTER` armazena uma cópia de cada arquivo de dados e cada arquivo de registro de desfazer em cada nó de dados no clúster. No NDB 8.0.13 e versões posteriores, a tabela `FILES` contém apenas uma linha para cada arquivo desse tipo. Suponha que você execute as seguintes duas declarações em um NDB Cluster com quatro nós de dados:

  ```
  CREATE LOGFILE GROUP mygroup
      ADD UNDOFILE 'new_undo.dat'
      INITIAL_SIZE 2G
      ENGINE NDBCLUSTER;

  CREATE TABLESPACE myts
      ADD DATAFILE 'data_1.dat'
      USE LOGFILE GROUP mygroup
      INITIAL_SIZE 256M
      ENGINE NDBCLUSTER;
  ```

Após executar essas duas declarações com sucesso, você deve ver um resultado semelhante ao mostrado aqui para essa consulta contra a tabela `FILES`:

  ```
  mysql> SELECT LOGFILE_GROUP_NAME, FILE_TYPE, EXTRA
      ->     FROM INFORMATION_SCHEMA.FILES
      ->     WHERE ENGINE = 'ndbcluster';

  +--------------------+-----------+--------------------------+
  | LOGFILE_GROUP_NAME | FILE_TYPE | EXTRA                    |
  +--------------------+-----------+--------------------------+
  | mygroup            | UNDO LOG  | UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | DATAFILE  | NULL                     |
  +--------------------+-----------+--------------------------+
  ```

O tamanho do buffer do registro de desfazer foi removido inadvertidamente no NDB 8.0.13, mas foi restaurado no NDB 8.0.15. (Bug #92796, Bug #28800252)

Antes da NDB 8.0.13, a tabela `FILES` continha uma linha para cada um desses arquivos em cada nó de dados ao qual o arquivo pertencia, além do tamanho do seu buffer de desfazer. Nessas versões, o resultado da mesma consulta contém uma linha por nó de dados, conforme mostrado aqui:

  ```
  +--------------------+-----------+-----------------------------------------+
  | LOGFILE_GROUP_NAME | FILE_TYPE | EXTRA                                   |
  +--------------------+-----------+-----------------------------------------+
  | mygroup            | UNDO LOG  | CLUSTER_NODE=5;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=6;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=7;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=8;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | DATAFILE  | CLUSTER_NODE=5                          |
  | mygroup            | DATAFILE  | CLUSTER_NODE=6                          |
  | mygroup            | DATAFILE  | CLUSTER_NODE=7                          |
  | mygroup            | DATAFILE  | CLUSTER_NODE=8                          |
  +--------------------+-----------+-----------------------------------------+
  ```

#### Notas

* `FILES` é uma tabela não padrão `INFORMATION_SCHEMA`.

* a partir do MySQL 8.0.21, você deve ter o privilégio `PROCESS` para consultar esta tabela.

#### Notas do InnoDB

As seguintes notas se aplicam aos arquivos de dados `InnoDB`.

* As informações relatadas por `FILES` são obtidas do cache `InnoDB` de memória para arquivos abertos, enquanto `INNODB_DATAFILES` obtém seus dados da tabela interna do dicionário de dados `InnoDB` `SYS_DATAFILES`.

* As informações fornecidas por `FILES` incluem informações sobre espaço de tabela temporária global que não estão disponíveis na tabela do dicionário de dados interno `InnoDB` `SYS_DATAFILES`, e, portanto, não estão incluídas em `INNODB_DATAFILES`.

As informações sobre os espaços de desfazer são exibidas em `FILES` quando espaços de desfazer separados estão presentes, como é o caso por padrão no MySQL 8.0.

* A consulta a seguir retorna todas as informações da tabela `FILES` relacionadas aos espaços de tabela `InnoDB`.

  ```
  SELECT
    FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    TOTAL_EXTENTS, EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE,
    AUTOEXTEND_SIZE, DATA_FREE, STATUS
  FROM INFORMATION_SCHEMA.FILES
  WHERE ENGINE='InnoDB'\G
  ```

#### Notas do NDB

* A tabela `FILES` fornece informações apenas sobre os arquivos de dados do disco; você não pode usá-la para determinar a alocação ou disponibilidade de espaço em disco para as tabelas individuais `NDB`. No entanto, é possível ver quanto espaço é alocado para cada tabela `NDB` que tem dados armazenados em disco — bem como quanto permanece disponível para o armazenamento de dados em disco para essa tabela — usando **ndb_desc**.

* A partir do NDB 8.0.29, grande parte das informações na tabela `FILES` também pode ser encontrada na tabela `ndbinfo.files`.

* Os valores de `CREATION_TIME`, `LAST_UPDATE_TIME` e `LAST_ACCESSED` são os relatados pelo sistema operacional e não são fornecidos pelo motor de armazenamento `NDB`. Quando nenhum valor é fornecido pelo sistema operacional, essas colunas exibem `NULL`.

* A diferença entre as colunas `TOTAL EXTENTS` e `FREE_EXTENTS` é o número de extensões atualmente em uso pelo arquivo:

  ```
  SELECT TOTAL_EXTENTS - FREE_EXTENTS AS extents_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

Para aproximar a quantidade de espaço em disco utilizado pelo arquivo, multiplique essa diferença pelo valor da coluna `EXTENT_SIZE`, que fornece o tamanho de uma extensão para o arquivo em bytes:

  ```
  SELECT (TOTAL_EXTENTS - FREE_EXTENTS) * EXTENT_SIZE AS bytes_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

Da mesma forma, você pode estimar a quantidade de espaço disponível em um arquivo específico, multiplicando `FREE_EXTENTS` por `EXTENT_SIZE`:

  ```
  SELECT FREE_EXTENTS * EXTENT_SIZE AS bytes_free
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

Importante

Os valores dos bytes produzidos pelas consultas anteriores são apenas aproximações e sua precisão é inversamente proporcional ao valor de `EXTENT_SIZE`. Isso significa que quanto maior o `EXTENT_SIZE`, menos precisas serão as aproximações.

É importante também lembrar que, uma vez que uma extensão é usada, ela não pode ser liberada novamente sem descartar o arquivo de dados do qual faz parte. Isso significa que as exclusões de uma tabela de Dados de disco *não* liberam espaço em disco.

O tamanho da extensão pode ser definido em uma declaração [[`CREATE TABLESPACE`][(create-tablespace.html "15.1.21 CREATE TABLESPACE Statement")]]. Para mais informações, consulte a Seção 15.1.21, “Declaração CREATE TABLESPACE”.

* Antes da NDB 8.0.13, uma linha adicional estava presente na tabela `FILES` após a criação de um grupo de arquivo de registro, com `NULL` na coluna `FILE_NAME`. Na NDB 8.0.13 e em versões posteriores, essa linha — que não correspondia a nenhum arquivo — não é mais exibida, e é necessário consultar a tabela `ndbinfo.logspaces` para obter informações sobre o uso do arquivo de registro de desfazer. Consulte a descrição dessa tabela, bem como a Seção 25.6.11.1, “Objetos de dados do disco do clúster NDB”, para obter mais informações.

O restante da discussão neste item aplica-se apenas ao NDB 8.0.12 e versões anteriores. Para a linha que tem `NULL` na coluna `FILE_NAME`, o valor da coluna `FILE_ID` é sempre `0`, o da coluna `FILE_TYPE` é sempre `UNDO LOG`, e o da coluna `STATUS` é sempre `NORMAL`. O valor da coluna `ENGINE` é sempre `ndbcluster`.

A coluna `FREE_EXTENTS` nesta linha mostra o número total de extensões livres disponíveis para todos os arquivos de desfazer pertencentes a um grupo de arquivos de registro específico, cujo nome e número são mostrados nas colunas `LOGFILE_GROUP_NAME` e `LOGFILE_GROUP_NUMBER`, respectivamente.

Suponha que não haja grupos de arquivos de registro existentes em seu NDB Cluster e que você crie um deles usando a seguinte declaração:

  ```
  mysql> CREATE LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile.dat'
           INITIAL_SIZE = 16M
           UNDO_BUFFER_SIZE = 1M
           ENGINE = NDB;
  ```

Agora você pode ver esta linha `NULL` ao consultar a tabela `FILES`:

  ```
  mysql> SELECT DISTINCT
           FILE_NAME AS File,
           FREE_EXTENTS AS Free,
           TOTAL_EXTENTS AS Total,
           EXTENT_SIZE AS Size,
           INITIAL_SIZE AS Initial
           FROM INFORMATION_SCHEMA.FILES;
  +--------------+---------+---------+------+----------+
  | File         | Free    | Total   | Size | Initial  |
  +--------------+---------+---------+------+----------+
  | undofile.dat |    NULL | 4194304 |    4 | 16777216 |
  | NULL         | 4184068 |    NULL |    4 |     NULL |
  +--------------+---------+---------+------+----------+
  ```

O número total de extensões gratuitas disponíveis para registro de desfazer é sempre um pouco menor que a soma dos valores da coluna `TOTAL_EXTENTS` para todos os arquivos de desfazer no grupo de arquivos de registro, devido ao sobrecarga necessária para manter os arquivos de desfazer. Isso pode ser visto ao adicionar um segundo arquivo de desfazer ao grupo de arquivos de registro, e depois repetir a consulta anterior contra a tabela `FILES`:

  ```
  mysql> ALTER LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile02.dat'
           INITIAL_SIZE = 4M
           ENGINE = NDB;

  mysql> SELECT DISTINCT
           FILE_NAME AS File,
           FREE_EXTENTS AS Free,
           TOTAL_EXTENTS AS Total,
           EXTENT_SIZE AS Size,
           INITIAL_SIZE AS Initial
           FROM INFORMATION_SCHEMA.FILES;
  +----------------+---------+---------+------+----------+
  | File           | Free    | Total   | Size | Initial  |
  +----------------+---------+---------+------+----------+
  | undofile.dat   |    NULL | 4194304 |    4 | 16777216 |
  | undofile02.dat |    NULL | 1048576 |    4 |  4194304 |
  | NULL           | 5223944 |    NULL |    4 |     NULL |
  +----------------+---------+---------+------+----------+
  ```

O espaço livre em bytes disponível para registro de desfazer em tabelas de Dados de disco usando este grupo de arquivos de registro pode ser aproximado multiplicando o número de extensões livres pelo tamanho inicial:

  ```
  mysql> SELECT
           FREE_EXTENTS AS 'Free Extents',
           FREE_EXTENTS * EXTENT_SIZE AS 'Free Bytes'
           FROM INFORMATION_SCHEMA.FILES
           WHERE LOGFILE_GROUP_NAME = 'lg1'
           AND FILE_NAME IS NULL;
  +--------------+------------+
  | Free Extents | Free Bytes |
  +--------------+------------+
  |      5223944 |   20895776 |
  +--------------+------------+
  ```

Se você criar uma tabela de Dados de disco do NDB Cluster e, em seguida, inserir algumas linhas nela, você pode ver aproximadamente quanto espaço permanece para o registro de desfazer, por exemplo:

  ```
  mysql> CREATE TABLESPACE ts1
           ADD DATAFILE 'data1.dat'
           USE LOGFILE GROUP lg1
           INITIAL_SIZE 512M
           ENGINE = NDB;

  mysql> CREATE TABLE dd (
           c1 INT NOT NULL PRIMARY KEY,
           c2 INT,
           c3 DATE
           )
           TABLESPACE ts1 STORAGE DISK
           ENGINE = NDB;

  mysql> INSERT INTO dd VALUES
           (NULL, 1234567890, '2007-02-02'),
           (NULL, 1126789005, '2007-02-03'),
           (NULL, 1357924680, '2007-02-04'),
           (NULL, 1642097531, '2007-02-05');

  mysql> SELECT
           FREE_EXTENTS AS 'Free Extents',
           FREE_EXTENTS * EXTENT_SIZE AS 'Free Bytes'
           FROM INFORMATION_SCHEMA.FILES
           WHERE LOGFILE_GROUP_NAME = 'lg1'
           AND FILE_NAME IS NULL;
  +--------------+------------+
  | Free Extents | Free Bytes |
  +--------------+------------+
  |      5207565 |   20830260 |
  +--------------+------------+
  ```

* Antes da NDB 8.0.13, uma linha adicional estava presente na tabela `FILES` para cada espaço de dados de disco do NDB Cluster. Como não correspondia a um arquivo real, foi removida na NDB 8.0.13. Essa linha tinha `NULL` para o valor da coluna `FILE_NAME`, o valor da coluna `FILE_ID` era sempre `0`, o da coluna `FILE_TYPE` era sempre `TABLESPACE`, o da coluna `STATUS` era sempre `NORMAL`, e o valor da coluna `ENGINE` é sempre `NDBCLUSTER`.

Em NDB 8.0.13 e versões posteriores, você pode obter informações sobre os espaços de dados de tabela de disco usando o utilitário **ndb_desc**. Para mais informações, consulte a Seção 25.6.11.1, “Objetos de dados de disco do cluster NDB”, bem como a descrição do **ndb_desc**.

* Para informações adicionais e exemplos de criação, eliminação e obtenção de informações sobre objetos de dados de disco do NDB Cluster, consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”.

### 28.3.16 A tabela INFORMATION_SCHEMA KEY_COLUMN_USAGE

A tabela `KEY_COLUMN_USAGE` descreve quais colunas principais têm restrições. Essa tabela não fornece informações sobre partes de chave funcional, porque são expressões e a tabela fornece informações apenas sobre colunas.

A tabela `KEY_COLUMN_USAGE` tem essas colunas:

* `CONSTRAINT_CATALOG`

O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

O nome da restrição.

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela que possui a restrição.

* `COLUMN_NAME`

O nome da coluna que possui a restrição.

Se a restrição for uma chave estrangeira, então esta é a coluna da chave estrangeira, e não a coluna que a chave estrangeira referencia.

* `ORDINAL_POSITION`

A posição da coluna dentro da restrição, não a posição da coluna dentro da tabela. As posições das colunas são numeradas a partir do número 1.

* `POSITION_IN_UNIQUE_CONSTRAINT`

`NULL` para restrições exclusivas e de chave primária. Para restrições de chave estrangeira, esta coluna é a posição ordinal na chave da tabela que está sendo referenciada.

* `REFERENCED_TABLE_SCHEMA`

O nome do esquema referenciado pela restrição.

* `REFERENCED_TABLE_NAME`

O nome da tabela referenciada pela restrição.

* `REFERENCED_COLUMN_NAME`

O nome da coluna referenciado pela restrição.

Suponha que existam duas tabelas chamadas `t1` e `t3` que têm as seguintes definições:

```
CREATE TABLE t1
(
    s1 INT,
    s2 INT,
    s3 INT,
    PRIMARY KEY(s3)
) ENGINE=InnoDB;

CREATE TABLE t3
(
    s1 INT,
    s2 INT,
    s3 INT,
    KEY(s1),
    CONSTRAINT CO FOREIGN KEY (s2) REFERENCES t1(s3)
) ENGINE=InnoDB;
```

Para essas duas tabelas, a tabela `KEY_COLUMN_USAGE` tem duas linhas:

* Uma linha com `CONSTRAINT_NAME` = `'PRIMARY'`, `TABLE_NAME` = `'t1'`, `COLUMN_NAME` = `'s3'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `NULL`.

Para `NDB`: Este valor é sempre `NULL`.

* Uma linha com `CONSTRAINT_NAME` = `'CO'`, `TABLE_NAME` = `'t3'`, `COLUMN_NAME` = `'s2'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `1`.

### 28.3.17 A tabela INFORMATION_SCHEMA KEYWORDS

A tabela `KEYWORDS` lista as palavras consideradas palavras-chave pelo MySQL e, para cada uma delas, indica se elas são reservadas. As palavras-chave reservadas podem exigir tratamento especial em alguns contextos, como a citação especial quando usadas como identificadores (consulte a Seção 11.3, “Palavras-chave e Palavras Reservadas”). Esta tabela fornece às aplicações uma fonte de informações em tempo real sobre palavras-chave do MySQL.

Antes do MySQL 8.0.13, selecionar a tabela `KEYWORDS` sem uma base de dados predefinida selecionada produzia um erro. (Bug #90160, Bug #27729859)

A tabela `KEYWORDS` tem essas colunas:

* `WORD`

A palavra-chave.

* `RESERVED`

Um número inteiro que indica se a palavra-chave é reservada (1) ou não reservada (0).

Essas consultas listam todas as palavras-chave, todas as palavras-chave reservadas e todas as palavras-chave não reservadas, respectivamente:

```
SELECT * FROM INFORMATION_SCHEMA.KEYWORDS;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED = 1;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED = 0;
```

As duas últimas perguntas são equivalentes a:

```
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE NOT RESERVED;
```

Se você construir o MySQL a partir do código-fonte, o processo de compilação gera um arquivo de cabeçalho `keyword_list.h` que contém uma matriz de palavras-chave e seu status reservado. Esse arquivo pode ser encontrado no diretório `sql` sob o diretório de compilação. Esse arquivo pode ser útil para aplicativos que exigem uma fonte estática para a lista de palavras-chave.

### 28.3.18 Tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map

A tabela `ndb_transid_mysql_connection_map` fornece uma mapeo entre as transações `NDB`, coordenadores de transações `NDB` e servidores MySQL conectados a um NDB Cluster como nós de API. Essas informações são usadas ao preencher as tabelas `server_operations` e `server_transactions` do banco de dados de informações do NDB Cluster `ndbinfo`.

<table summary="Columns in the INFORMATION_SCHEMA ndb_transid_mysql_connection_map table. The table lists INFORMATION_SCHEMA names along with corresponding SHOW names (if applicable), and remarks."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col"><code>INFORMATION_SCHEMA</code> Name</th> <th scope="col"><code>SHOW</code> Name</th> <th scope="col">Remarks</th> </tr></thead><tbody><tr> <th scope="row"><code>mysql_connection_id</code></th> <td></td> <td>ID de conexão do MySQL Server</td> </tr><tr> <th scope="row"><code>node_id</code></th> <td></td> <td>ID do nó do coordenador de transação</td> </tr><tr> <th scope="row"><code>ndb_transid</code></th> <td></td> <td><code>NDB</code> transaction ID</td> </tr></tbody></table>

O `mysql_connection_id` é o mesmo que o ID de conexão ou sessão mostrado na saída do `SHOW PROCESSLIST`.

Não há declarações `SHOW` associadas a esta tabela.

Esta é uma tabela não padrão, específica para o NDB Cluster. É implementada como um plugin `INFORMATION_SCHEMA`; você pode verificar se é suportada verificando a saída do `SHOW PLUGINS`. Se o suporte ao `ndb_transid_mysql_connection_map` estiver habilitado, a saída desta declaração inclui um plugin com este nome, do tipo `INFORMATION SCHEMA`, e com status `ACTIVE`, conforme mostrado aqui (usando texto em negrito):

```
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha256_password                  | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| caching_sha2_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha2_cache_cleaner               | ACTIVE | AUDIT              | NULL    | GPL     |
| daemon_keyring_proxy_plugin      | ACTIVE | DAEMON             | NULL    | GPL     |
| CSV                              | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| InnoDB                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |

...

| INNODB_SESSION_TEMP_TABLESPACES  | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| MyISAM                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| TempTable                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbcluster                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| ngram                            | ACTIVE | FTPARSER           | NULL    | GPL     |
| mysqlx_cache_cleaner             | ACTIVE | AUDIT              | NULL    | GPL     |
| mysqlx                           | ACTIVE | DAEMON             | NULL    | GPL     |
+----------------------------------+--------+--------------------+---------+---------+
47 rows in set (0.01 sec)
```

O plugin é ativado por padrão. Você pode desativá-lo (ou forçar o servidor a não funcionar a menos que o plugin seja iniciado) iniciando o servidor com a opção `--ndb-transid-mysql-connection-map`. Se o plugin estiver desativado, o status é mostrado por `SHOW PLUGINS` como `DISABLED`. O plugin não pode ser ativado ou desativado em tempo real.

Embora os nomes desta tabela e suas colunas sejam exibidos em letras minúsculas, você pode usar letras maiúsculas ou minúsculas ao se referir a eles em declarações SQL.

Para que essa tabela seja criada, o MySQL Server deve ser um binário fornecido com a distribuição do NDB Cluster, ou um binário construído a partir das fontes do NDB Cluster com suporte ao mecanismo de armazenamento `NDB`. Não está disponível no servidor padrão MySQL 8.0.

### 28.3.19 A tabela INFORMATION_SCHEMA OPTIMIZER_TRACE

A tabela `OPTIMIZER_TRACE` fornece informações produzidas pela capacidade de rastreamento do otimizador para instruções rastreadas. Para habilitar o rastreamento, use a variável de sistema `optimizer_trace`. Para obter detalhes, consulte a Seção 10.15, “Rastreamento do Otimizador”.

A tabela `OPTIMIZER_TRACE` tem essas colunas:

* `QUERY`

O texto da declaração traçada.

* `TRACE`

A traçada, no formato `JSON`.

* `MISSING_BYTES_BEYOND_MAX_MEM_SIZE`

Cada rastro lembrado é uma cadeia que é estendida à medida que a otimização progride e anexa dados a ela. A variável `optimizer_trace_max_mem_size` define um limite sobre a quantidade total de memória usada por todos os rastros lembrados atualmente. Se esse limite for atingido, o rastro atual não é estendido (e, portanto, é incompleto), e a coluna `MISSING_BYTES_BEYOND_MAX_MEM_SIZE` mostra o número de bytes que faltam no rastro.

* `INSUFFICIENT_PRIVILEGES`

Se uma consulta rastreada usar visualizações ou rotinas armazenadas que tenham `SQL SECURITY` com um valor de `DEFINER`, pode ser que um usuário diferente do definidor seja negado a ver o rastreamento da consulta. Nesse caso, o rastreamento é mostrado como vazio e `INSUFFICIENT_PRIVILEGES` tem um valor de 1. Caso contrário, o valor é 0.

### 28.3.20 Tabela SCHEMA_PARAMETERS de INFORMATION_SCHEMA

A tabela `PARAMETERS` fornece informações sobre os parâmetros para rotinas armazenadas (procedimentos armazenados e funções armazenadas), e sobre os valores de retorno para funções armazenadas. A tabela `PARAMETERS` não inclui funções internas (nativas) ou funções carregáveis.

A tabela `PARAMETERS` tem essas colunas:

* `SPECIFIC_CATALOG`

O nome do catálogo ao qual a rotina que contém o parâmetro pertence. Esse valor é sempre `def`.

* `SPECIFIC_SCHEMA`

O nome do esquema (banco de dados) ao qual a rotina que contém o parâmetro pertence.

* `SPECIFIC_NAME`

O nome da rotina que contém o parâmetro.

* `ORDINAL_POSITION`

Para os parâmetros sucessivos de um procedimento ou função armazenada, os valores de `ORDINAL_POSITION` são 1, 2, 3, e assim por diante. Para uma função armazenada, também há uma linha que se aplica ao valor de retorno da função (como descrito pela cláusula `RETURNS`). O valor de retorno não é um parâmetro verdadeiro, então a linha que o descreve tem essas características únicas:

+ O valor `ORDINAL_POSITION` é 0.  
+ Os valores `PARAMETER_NAME` e `PARAMETER_MODE` são `NULL` porque o valor de retorno não tem nome e o modo não se aplica.

* `PARAMETER_MODE`

O modo do parâmetro. Esse valor é um dos `IN`, `OUT` ou `INOUT`. Para um valor de retorno de função armazenada, esse valor é `NULL`.

* `PARAMETER_NAME`

O nome do parâmetro. Para um valor de retorno de função armazenada, esse valor é `NULL`.

* `DATA_TYPE`

O tipo de dados do parâmetro.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `CHARACTER_MAXIMUM_LENGTH`

Para parâmetros de cadeia, o comprimento máximo em caracteres.

* `CHARACTER_OCTET_LENGTH`

Para parâmetros de cadeia, o comprimento máximo em bytes.

* `NUMERIC_PRECISION`

Para parâmetros numéricos, a precisão numérica.

* `NUMERIC_SCALE`

Para parâmetros numéricos, a escala numérica.

* `DATETIME_PRECISION`

Para os parâmetros temporais, a precisão de segundos fracionários.

* `CHARACTER_SET_NAME`

Para parâmetros de cadeia de caracteres, o nome do conjunto de caracteres.

* `COLLATION_NAME`

Para parâmetros de cadeia de caracteres, o nome da correção.

* `DTD_IDENTIFIER`

O tipo de dados do parâmetro.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `ROUTINE_TYPE`

`PROCEDURE` para procedimentos armazenados, `FUNCTION` para funções armazenadas.

### 28.3.21 A tabela INFORMATION_SCHEMA PARTITIONS

A tabela `PARTITIONS` fornece informações sobre partições de tabela. Cada linha desta tabela corresponde a uma partição ou subpartição individual de uma tabela particionada. Para mais informações sobre particionamento de tabelas, consulte o Capítulo 26, *Particionamento*.

A tabela `PARTITIONS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela que contém a partição.

* `PARTITION_NAME`

O nome da partição.

* `SUBPARTITION_NAME`

Se a linha da tabela `PARTITIONS` representar uma subpartição, o nome da subpartição; caso contrário, `NULL`.

Para `NDB`: Este valor é sempre `NULL`.

* `PARTITION_ORDINAL_POSITION`

Todas as partições são indexadas na mesma ordem em que são definidas, com `1` sendo o número atribuído à primeira partição. A indexação pode mudar à medida que as partições são adicionadas, excluídas e reorganizadas; o número mostrado neste campo reflete a ordem atual, levando em conta quaisquer mudanças na indexação.

* `SUBPARTITION_ORDINAL_POSITION`

As subpartições dentro de uma partição dada também são indexadas e reindexadas da mesma maneira que as partições são indexadas dentro de uma tabela.

* `PARTITION_METHOD`

Um dos valores `RANGE`, `LIST`, `HASH`, `LINEAR HASH`, `KEY` ou `LINEAR KEY`; ou seja, um dos tipos de particionamento disponíveis, conforme discutido na Seção 26.2, “Tipos de Particionamento”.

* `SUBPARTITION_METHOD`

Um dos valores `HASH`, `LINEAR HASH`, `KEY` ou `LINEAR KEY`; ou seja, um dos tipos de subpartição disponíveis, conforme discutido na Seção 26.2.6, “Subpartição”.

* `PARTITION_EXPRESSION`

A expressão para a função de particionamento usada na declaração `CREATE TABLE` ou `ALTER TABLE` que criou o esquema de particionamento atual da tabela.

Por exemplo, considere uma tabela dividida criada no banco de dados `test` usando esta declaração:

  ```
  CREATE TABLE tp (
      c1 INT,
      c2 INT,
      c3 VARCHAR(25)
  )
  PARTITION BY HASH(c1 + c2)
  PARTITIONS 4;
  ```

A coluna `PARTITION_EXPRESSION` em uma linha da tabela `PARTITIONS` para uma partição desta tabela exibe `c1 + c2`, conforme mostrado aqui:

  ```
  mysql> SELECT DISTINCT PARTITION_EXPRESSION
         FROM INFORMATION_SCHEMA.PARTITIONS
         WHERE TABLE_NAME='tp' AND TABLE_SCHEMA='test';
  +----------------------+
  | PARTITION_EXPRESSION |
  +----------------------+
  | c1 + c2              |
  +----------------------+
  ```

Para uma tabela que não esteja explicitamente particionada, essa coluna é sempre `NULL`, independentemente do mecanismo de armazenamento.

* `SUBPARTITION_EXPRESSION`

Isso funciona da mesma maneira para a expressão de subpartição que define a subpartição para uma tabela, como o `PARTITION_EXPRESSION` faz com a expressão de partição usada para definir a partição de uma tabela.

Se a tabela não tiver subpartições, esta coluna é `NULL`.

* `PARTITION_DESCRIPTION`

Esta coluna é usada para as partições RANGE e LIST. Para uma partição `RANGE`, ela contém o valor definido na cláusula `VALUES LESS THAN` da partição, que pode ser um inteiro ou `MAXVALUE`. Para uma partição `LIST`, esta coluna contém os valores definidos na cláusula `VALUES IN` da partição, que é uma lista de valores inteiros separados por vírgula.

Para divisões cuja `PARTITION_METHOD` é diferente de `RANGE` ou `LIST`, esta coluna é sempre `NULL`.

* `TABLE_ROWS`

O número de linhas de tabela na partição.

Para tabelas `InnoDB` particionadas, o número de linhas fornecido na coluna `TABLE_ROWS` é apenas um valor estimado utilizado na otimização do SQL e pode não ser sempre exato.

Para as tabelas de `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `AVG_ROW_LENGTH`

O comprimento médio das linhas armazenadas nesta partição ou subpartição, em bytes. Isso é o mesmo que `DATA_LENGTH` dividido por `TABLE_ROWS`.

Para as tabelas de `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `DATA_LENGTH`

O comprimento total de todas as linhas armazenadas nesta partição ou subpartição, em bytes; ou seja, o número total de bytes armazenados na partição ou subpartição.

Para as tabelas de `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `MAX_DATA_LENGTH`

O número máximo de bytes que podem ser armazenados nesta partição ou subpartição.

Para as tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `INDEX_LENGTH`

O comprimento do arquivo de índice para esta partição ou subpartição, em bytes.

Para partições de tabelas `NDB`, independentemente de as tabelas utilizarem partição implícita ou explícita, o valor da coluna `INDEX_LENGTH` é sempre 0. No entanto, você pode obter informações equivalentes usando o utilitário **ndb_desc**.

* `DATA_FREE`

O número de bytes alocados para a partição ou subpartição, mas não utilizados.

Para as tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `CREATE_TIME`

O momento em que a partição ou subpartição foi criada.

* `UPDATE_TIME`

O horário em que a partição ou subpartição foi modificada pela última vez.

* `CHECK_TIME`

A última vez que a tabela a qual esta partição ou subpartição pertence foi verificada.

Para as tabelas `InnoDB` particionadas, o valor é sempre `NULL`.

* `CHECKSUM`

O valor do checksum, se houver; caso contrário, `NULL`.

* `PARTITION_COMMENT`

O texto do comentário, se a partição tiver um. Se não, este valor está vazio.

O comprimento máximo para um comentário de partição é definido como 1024 caracteres, e a largura de exibição da coluna `PARTITION_COMMENT` também é de 1024 caracteres, para corresponder a esse limite.

* `NODEGROUP`

Este é o grupo de nós ao qual a partição pertence. Para as tabelas do NDB Cluster, este é sempre `default`. Para tabelas particionadas que utilizam motores de armazenamento diferentes de `NDB`, o valor também é `default`. Caso contrário, esta coluna está vazia.

* `TABLESPACE_NAME`

O nome do tablespace ao qual a partição pertence. O valor é sempre `DEFAULT`, a menos que a tabela utilize o mecanismo de armazenamento `NDB` (consulte as *Notas* no final desta seção).

#### Notas

* `PARTITIONS` é uma tabela não padrão `INFORMATION_SCHEMA`.

* Uma tabela que utiliza qualquer mecanismo de armazenamento diferente de `NDB` e que não esteja particionada tem uma linha na tabela `PARTITIONS`. No entanto, os valores das colunas `PARTITION_NAME`, `SUBPARTITION_NAME`, `PARTITION_ORDINAL_POSITION`, `SUBPARTITION_ORDINAL_POSITION`, `PARTITION_METHOD`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION` e `PARTITION_DESCRIPTION` são todos `NULL`. Além disso, a coluna `PARTITION_COMMENT` neste caso está em branco.

* Uma tabela `NDB` que não está explicitamente particionada tem uma linha na tabela `PARTITIONS` para cada nó de dados no cluster NDB. Para cada uma dessas linhas:

As colunas `SUBPARTITION_NAME`, `SUBPARTITION_ORDINAL_POSITION`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION`, `CREATE_TIME`, `UPDATE_TIME`, `CHECK_TIME`, `CHECKSUM` e `TABLESPACE_NAME` são todas `NULL`.

+ O `PARTITION_METHOD` é sempre `AUTO`.

+ A coluna `NODEGROUP` é `default`.

+ A coluna `PARTITION_COMMENT` está vazia.

### 28.3.22 A tabela de PLUGS do esquema de informação_schema

A tabela `PLUGINS` fornece informações sobre plugins do servidor.

A tabela `PLUGINS` tem essas colunas:

* `PLUGIN_NAME`

O nome usado para se referir ao plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* `PLUGIN_VERSION`

A versão do descritor de tipo geral do plugin.

* `PLUGIN_STATUS`

O status do plugin, um dos `ACTIVE`, `INACTIVE`, `DISABLED`, `DELETING` ou `DELETED`.

* `PLUGIN_TYPE`

O tipo de plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

* `PLUGIN_TYPE_VERSION`

A versão do descritor específico do tipo do plugin.

* `PLUGIN_LIBRARY`

O nome do arquivo de biblioteca compartilhada do plugin. Este é o nome usado para se referir ao arquivo do plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`. Este arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. Se o nome da biblioteca for `NULL`, o plugin é compilado e não pode ser desinstalado com `UNINSTALL PLUGIN`.

* `PLUGIN_LIBRARY_VERSION`

Versão da interface da API do plugin.

* `PLUGIN_AUTHOR`

O autor do plugin.

* `PLUGIN_DESCRIPTION`

Uma breve descrição do plugin.

* `PLUGIN_LICENSE`

Como o plugin é licenciado (por exemplo, `GPL`).

* `LOAD_OPTION`

Como o plugin foi carregado. O valor é `OFF`, `ON`, `FORCE` ou `FORCE_PLUS_PERMANENT`. Veja a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

#### Notas

* `PLUGINS` é uma tabela não padrão `INFORMATION_SCHEMA`.

* Para plugins instalados com `INSTALL PLUGIN`(install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement"), os valores `PLUGIN_NAME` e `PLUGIN_LIBRARY` também são registrados na tabela `mysql.plugin`.

* Para informações sobre as estruturas de dados dos plugins que formam a base das informações na tabela `PLUGINS`, consulte a API do Plugin MySQL.

As informações sobre os plugins também estão disponíveis na declaração `SHOW PLUGINS`. Veja a Seção 15.7.7.25, “Declaração SHOW PLUGINS”. Essas declarações são equivalentes:

```
SELECT
  PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE,
  PLUGIN_LIBRARY, PLUGIN_LICENSE
FROM INFORMATION_SCHEMA.PLUGINS;

SHOW PLUGINS;
```

### 28.3.23 A tabela INFORMATION_SCHEMA PROCESSLIST

Importante

`INFORMATION_SCHEMA.PROCESSLIST` é descontinuada e sujeita à remoção em uma futura versão do MySQL. Como tal, a implementação de `SHOW PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement") que utiliza esta tabela também é descontinuada. Recomenda-se usar a implementação do Schema de Desempenho de `PROCESSLIST` em vez disso.

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas dentro do servidor. A tabela `PROCESSLIST` é uma fonte de informações sobre os processos. Para uma comparação desta tabela com outras fontes, consulte Fontes de Informações sobre Processos.

A tabela `PROCESSLIST` tem essas colunas:

* `ID`

O identificador de conexão. Este é o mesmo valor exibido na coluna `Id` da declaração `SHOW PROCESSLIST`, exibida na coluna `PROCESSLIST_ID` da tabela do Gerador de Desempenho `threads`, e retornada pela função `CONNECTION_ID()` dentro do thread.

* `USER`

O usuário do MySQL que emitiu a declaração. Um valor de `system user` refere-se a um fio não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um fio de manipulação de linha atrasada ou um fio de E/S ou SQL usado em hosts replicados. Para `system user`, não há um host especificado na coluna `Host`. `unauthenticated user` refere-se a um fio que se tornou associado a uma conexão com cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao fio que monitora eventos agendados (ver Seção 27.4, “Usando o Cronograma de Eventos”).

Nota

Um valor `USER` de `system user` é distinto do privilégio `SYSTEM_USER`. O primeiro designa os threads internos. Este último distingue as categorias de contas de usuário do sistema e as contas de usuário regulares (consulte a Seção 8.2.11, “Categorias de Conta”).

* `HOST`

O nome do host do cliente que emite a declaração (exceto para `system user`, para o qual não há nenhum nome de host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

* `DB`

O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

* `COMMAND`

O tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte a Seção 10.14, “Examinando as Informações do Thread (Processo) do Servidor” (Informações). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

* `TIME`

O tempo em segundos que o fio esteve em seu estado atual. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 19.2.3, “Fios de Replicação”.

* `STATE`

Uma ação, evento ou estado que indica o que o fio está fazendo. Para descrições dos valores de `STATE`, consulte a Seção 10.14, “Examinando informações do fio do servidor (processo”) (Informações).

A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

* `INFO`

A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a que é enviada ao servidor, ou uma declaração interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `INFO` mostra a declaração `SELECT`.

#### Notas

* `PROCESSLIST` é uma tabela não padrão `INFORMATION_SCHEMA`.

* Assim como a saída da declaração `SHOW PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement"), a tabela `PROCESSLIST` fornece informações sobre todos os tópicos, mesmo aqueles pertencentes a outros usuários, se você tiver o privilégio `PROCESS`. Caso contrário (sem o privilégio `PROCESS`, os usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não sobre os tópicos de outros usuários, e os usuários anônimos não têm acesso às informações dos tópicos.

* Se uma declaração SQL se referir à tabela `PROCESSLIST`, o MySQL preenche toda a tabela uma vez, quando a execução da declaração começa, portanto, há consistência de leitura durante a declaração. Não há consistência de leitura para uma transação de múltiplas declarações.

As seguintes declarações são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST

SHOW FULL PROCESSLIST
```

### 28.3.24 A tabela INFORMATION_SCHEMA PROFILING

A tabela `PROFILING` fornece informações de perfilagem de declarações. Seu conteúdo corresponde às informações produzidas pelas declarações `SHOW PROFILE` e `SHOW PROFILES` (ver Seção 15.7.7.30, “Declaração SHOW PROFILE”). A tabela está vazia, a menos que a variável de sessão `profiling` esteja definida como 1.

Nota

Essa tabela é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use o Símio de Desempenho em vez disso; veja a Seção 29.19.1, “Profilagem de consulta usando o Símio de Desempenho”.

A tabela `PROFILING` tem essas colunas:

* `QUERY_ID`

Um identificador de declaração numérica.

* `SEQ`

Um número de sequência que indica a ordem de exibição das linhas com o mesmo valor de `QUERY_ID`.

* `STATE`

O perfil indica o estado ao qual as medições da linha se aplicam.

* `DURATION`

Quanto tempo a execução da declaração permaneceu no estado dado, em segundos.

* `CPU_USER`, `CPU_SYSTEM`

Uso do CPU do usuário e do sistema, em segundos.

* `CONTEXT_VOLUNTARY`, `CONTEXT_INVOLUNTARY`

Quantas trocas de contexto voluntárias e involuntárias ocorreram.

* `BLOCK_OPS_IN`, `BLOCK_OPS_OUT`

O número de operações de entrada e saída de bloco.

* `MESSAGES_SENT`, `MESSAGES_RECEIVED`

O número de mensagens de comunicação enviadas e recebidas.

* `PAGE_FAULTS_MAJOR`, `PAGE_FAULTS_MINOR`

O número de falhas de página principais e secundárias.

* `SWAPS`

Quantas trocas ocorreram.

* `SOURCE_FUNCTION`, `SOURCE_FILE` e `SOURCE_LINE`

Informações que indicam onde no código-fonte o estado perfilado é executado.

#### Notas

* `PROFILING` é uma tabela não padrão `INFORMATION_SCHEMA`.

As informações de perfilamento também estão disponíveis nas declarações `SHOW PROFILE` e `SHOW PROFILES`. Veja a Seção 15.7.7.30, “Declaração SHOW PROFILE”. Por exemplo, as seguintes consultas são equivalentes:

```
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```

### 28.3.25 A tabela INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS

A tabela `REFERENTIAL_CONSTRAINTS` fornece informações sobre chaves estrangeiras.

A tabela `REFERENTIAL_CONSTRAINTS` tem essas colunas:

* `CONSTRAINT_CATALOG`

O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

O nome da restrição.

* `UNIQUE_CONSTRAINT_CATALOG`

O nome do catálogo que contém a restrição única que a restrição refere. Esse valor é sempre `def`.

* `UNIQUE_CONSTRAINT_SCHEMA`

O nome do esquema que contém a restrição exclusiva que a restrição refere.

* `UNIQUE_CONSTRAINT_NAME`

O nome da restrição única que a restrição refere.

* `MATCH_OPTION`

O valor do atributo `MATCH`. O único valor válido neste momento é `NONE`.

* `UPDATE_RULE`

O valor do atributo `ON UPDATE`. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `DELETE_RULE`

O valor do atributo `ON DELETE`. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `TABLE_NAME`

O nome da tabela. Esse valor é o mesmo que na tabela `TABLE_CONSTRAINTS`.

* `REFERENCED_TABLE_NAME`

O nome da tabela referenciada pela restrição.

### 28.3.26 A tabela Tabela de GRUPOS_DE_RECURSOS_SCHEMA_DE_INFORMACAO

A tabela `RESOURCE_GROUPS` fornece acesso a informações sobre grupos de recursos. Para discussão geral sobre a capacidade do grupo de recursos, consulte a Seção 7.1.16, “Grupos de Recursos”.

Você pode ver informações apenas para as colunas para as quais você tem algum privilégio.

A tabela `RESOURCE_GROUPS` tem essas colunas:

* `RESOURCE_GROUP_NAME`

O nome do grupo de recursos.

* `RESOURCE_GROUP_TYPE`

O tipo de grupo de recursos, seja `SYSTEM` ou `USER`.

* `RESOURCE_GROUP_ENABLED`

Se o grupo de recursos está habilitado (1) ou desabilitado (0);

* `VCPU_IDS`

A afinidade da CPU; ou seja, o conjunto de CPUs virtuais que o grupo de recursos pode usar. O valor é uma lista de números de CPU ou intervalos separados por vírgula.

* `THREAD_PRIORITY`

A prioridade para os threads atribuídos ao grupo de recursos. A prioridade varia de -20 (maior prioridade) a 19 (menor prioridade). Os grupos de recursos do sistema têm uma prioridade que varia de -20 a 0. Os grupos de recursos do usuário têm uma prioridade que varia de 0 a 19.

### 28.3.27 A tabela INFORMATION_SCHEMA ROLE_COLUMN_GRANTS

A tabela `ROLE_COLUMN_GRANTS` (disponível a partir do MySQL 8.0.19) fornece informações sobre os privilégios da coluna para os papéis que estão disponíveis para os papéis atualmente habilitados ou concedidos por eles.

A tabela `ROLE_COLUMN_GRANTS` tem essas colunas:

* `GRANTOR`

A parte do nome de usuário da conta que concedeu o papel.

* `GRANTOR_HOST`

A parte do nome de host da conta que concedeu o papel.

* `GRANTEE`

A parte do nome de usuário da conta à qual o papel é concedido.

* `GRANTEE_HOST`

A parte do nome de host da conta à qual o papel é concedido.

* `TABLE_CATALOG`

O nome do catálogo ao qual o papel se aplica. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual o papel se aplica.

* `TABLE_NAME`

O nome da tabela à qual o papel se aplica.

* `COLUMN_NAME`

O nome da coluna à qual o papel se aplica.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da coluna; veja a Seção 15.7.1.6, "Declaração GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio da coluna detido pelo beneficiário.

* `IS_GRANTABLE`

`YES` ou `NO`, dependendo se o papel é concedível a outras contas.

### 28.3.28 A tabela INFORMATION_SCHEMA ROLE_ROUTINE_GRANTS

A tabela `ROLE_ROUTINE_GRANTS` (disponível a partir do MySQL 8.0.19) fornece informações sobre os privilégios de rotina para os papéis que estão disponíveis para os papéis atualmente habilitados ou concedidos por eles.

A tabela `ROLE_ROUTINE_GRANTS` tem essas colunas:

* `GRANTOR`

A parte do nome de usuário da conta que concedeu o papel.

* `GRANTOR_HOST`

A parte do nome de host da conta que concedeu o papel.

* `GRANTEE`

A parte do nome de usuário da conta à qual o papel é concedido.

* `GRANTEE_HOST`

A parte do nome de host da conta à qual o papel é concedido.

* `SPECIFIC_CATALOG`

O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

* `SPECIFIC_SCHEMA`

O nome do esquema (banco de dados) ao qual a rotina pertence.

* `SPECIFIC_NAME`

O nome da rotina.

* `ROUTINE_CATALOG`

O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

* `ROUTINE_SCHEMA`

O nome do esquema (banco de dados) ao qual a rotina pertence.

* `ROUTINE_NAME`

O nome da rotina.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível de rotina; veja a Seção 15.7.1.6, "Declaração GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio da coluna detido pelo beneficiário.

* `IS_GRANTABLE`

`YES` ou `NO`, dependendo se o papel é concedível a outras contas.

### 28.3.29 A tabela de PERMISSÕES da tabela de ROLES do esquema de informações_schema_SCHEMA_SCHEMA

A tabela `ROLE_TABLE_GRANTS` (disponível a partir do MySQL 8.0.19) fornece informações sobre os privilégios da tabela para os papéis que estão disponíveis para os papéis atualmente habilitados ou concedidos por eles.

A tabela `ROLE_TABLE_GRANTS` tem essas colunas:

* `GRANTOR`

A parte do nome de usuário da conta que concedeu o papel.

* `GRANTOR_HOST`

A parte do nome de host da conta que concedeu o papel.

* `GRANTEE`

A parte do nome de usuário da conta à qual o papel é concedido.

* `GRANTEE_HOST`

A parte do nome de host da conta à qual o papel é concedido.

* `TABLE_CATALOG`

O nome do catálogo ao qual o papel se aplica. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual o papel se aplica.

* `TABLE_NAME`

O nome da tabela à qual o papel se aplica.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da tabela; veja a Seção 15.7.1.6, "Declaração GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio de coluna mantido pelo beneficiário.

* `IS_GRANTABLE`

`YES` ou `NO`, dependendo se o papel é concedível a outras contas.

### 28.3.30 A tabela Tabela de ROUTINAS do SCHEMA_INFORMACIONAL

A tabela `ROUTINES` fornece informações sobre rotinas armazenadas (procedimentos armazenados e funções armazenadas). A tabela `ROUTINES` não inclui funções integrais (nativas) ou funções carregáveis.

A tabela `ROUTINES` tem essas colunas:

* `SPECIFIC_NAME`

O nome da rotina.

* `ROUTINE_CATALOG`

O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

* `ROUTINE_SCHEMA`

O nome do esquema (banco de dados) ao qual a rotina pertence.

* `ROUTINE_NAME`

O nome da rotina.

* `ROUTINE_TYPE`

`PROCEDURE` para procedimentos armazenados, `FUNCTION` para funções armazenadas.

* `DATA_TYPE`

Se a rotina for uma função armazenada, o tipo de dados do valor de retorno. Se a rotina for um procedimento armazenado, esse valor é vazio.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `CHARACTER_MAXIMUM_LENGTH`

Para valores de retorno de string de função armazenada, o comprimento máximo em caracteres. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `CHARACTER_OCTET_LENGTH`

Para valores de retorno de string de função armazenada, o comprimento máximo em bytes. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `NUMERIC_PRECISION`

Para valores de retorno numéricos de função armazenada, a precisão numérica. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `NUMERIC_SCALE`

Para valores de retorno numéricos de função armazenada, a escala numérica. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `DATETIME_PRECISION`

Para valores de retorno temporais de função armazenada, a precisão de frações de segundo. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `CHARACTER_SET_NAME`

Para valores de retorno de cadeia de caracteres de função armazenada, o nome do conjunto de caracteres. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `COLLATION_NAME`

Para valores de retorno de cadeia de caracteres de função armazenada, o nome da correção. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `DTD_IDENTIFIER`

Se a rotina for uma função armazenada, o tipo de dados do valor de retorno. Se a rotina for um procedimento armazenado, esse valor é vazio.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `ROUTINE_BODY`

A linguagem utilizada para a definição rotineira. Esse valor é sempre `SQL`.

* `ROUTINE_DEFINITION`

O texto da declaração SQL executada pela rotina.

* `EXTERNAL_NAME`

Esse valor é sempre `NULL`.

* `EXTERNAL_LANGUAGE`

A linguagem da rotina armazenada. O valor é lido da coluna `external_language` da tabela do dicionário de dados `mysql.routines`.

* `PARAMETER_STYLE`

Esse valor é sempre `SQL`.

* `IS_DETERMINISTIC`

`YES` ou `NO`, dependendo se a rotina é definida com a característica `DETERMINISTIC`.

* `SQL_DATA_ACCESS`

A característica de acesso aos dados para a rotina. O valor é um dos `CONTAINS SQL`, `NO SQL`, `READS SQL DATA` ou `MODIFIES SQL DATA`.

* `SQL_PATH`

Esse valor é sempre `NULL`.

* `SECURITY_TYPE`

A característica da rotina `SQL SECURITY`. O valor é um dos `DEFINER` ou `INVOKER`.

* `CREATED`

A data e a hora em que a rotina foi criada. Este é um valor `TIMESTAMP`.

* `LAST_ALTERED`

A data e a hora em que a rotina foi modificada pela última vez. Este é um valor `TIMESTAMP`. Se a rotina não foi modificada desde sua criação, este valor é o mesmo que o valor `CREATED`.

* `SQL_MODE`

O modo SQL em vigor quando a rotina foi criada ou alterada, e sob o qual a rotina é executada. Para os valores permitidos, consulte a Seção 7.1.11, “Modos SQL do servidor”.

* `ROUTINE_COMMENT`

O texto do comentário, se a rotina tiver um. Se não, este valor está vazio.

* `DEFINER`

A conta nomeada na cláusula `DEFINER` (frequentemente o usuário que criou a rotina), no formato `'user_name'@'host_name'`.

* `CHARACTER_SET_CLIENT`

O valor de sessão da variável de sistema `character_set_client` quando a rotina foi criada.

* `COLLATION_CONNECTION`

O valor de sessão da variável de sistema `collation_connection` quando a rotina foi criada.

* `DATABASE_COLLATION`

A agregação do banco de dados com o qual a rotina está associada.

#### Notas

* Para ver informações sobre uma rotina, você deve ser o usuário nomeado como a rotina `DEFINER`, ter o privilégio `SHOW_ROUTINE`, ter o privilégio `SELECT` no nível global, ou ter o privilégio [`CREATE ROUTINE`(privileges-provided.html#priv_create-routine), [`ALTER ROUTINE`(privileges-provided.html#priv_alter-routine), ou `EXECUTE` concedido em um escopo que inclua a rotina. A coluna `ROUTINE_DEFINITION` é `NULL` se você tiver apenas `CREATE ROUTINE`, `ALTER ROUTINE`, ou `EXECUTE`.

* Informações sobre os valores de retorno de funções armazenadas também estão disponíveis na tabela `PARAMETERS`. A linha de valor de retorno de uma função armazenada pode ser identificada como a linha que tem um valor de `ORDINAL_POSITION` de 0.

### 28.3.31 A tabela INFORMATION_SCHEMA SCHEMATA

Um esquema é um banco de dados, portanto, a tabela `SCHEMATA` fornece informações sobre bancos de dados.

A tabela `SCHEMATA` tem essas colunas:

* `CATALOG_NAME`

O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

* `SCHEMA_NAME`

O nome do esquema.

* `DEFAULT_CHARACTER_SET_NAME`

O conjunto de caracteres padrão do esquema.

* `DEFAULT_COLLATION_NAME`

O esquema de collation padrão.

* `SQL_PATH`

Esse valor é sempre `NULL`.

* `DEFAULT_ENCRYPTION`

O esquema de criptografia padrão. Esta coluna foi adicionada no MySQL 8.0.16.

Os nomes dos esquemas também estão disponíveis na declaração `SHOW DATABASES` (show-databases.html "15.7.7.14 SHOW DATABASES Statement"). Veja a Seção 15.7.7.14, “Declaração SHOW DATABASES”. As seguintes declarações são equivalentes:

```
SELECT SCHEMA_NAME AS `Database`
  FROM INFORMATION_SCHEMA.SCHEMATA
  [WHERE SCHEMA_NAME LIKE 'wild']

SHOW DATABASES
  [LIKE 'wild']
```

Você só verá os bancos de dados para os quais você tem algum tipo de privilégio, a menos que você tenha o privilégio global `SHOW DATABASES`(show-databases.html "15.7.7.14 SHOW DATABASES Statement").

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todos os bancos de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes dos bancos de dados com `SHOW DATABASES` (show-databases.html "15.7.7.14 SHOW DATABASES Statement") ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto bancos de dados que tenham sido restringidos no nível do banco de dados por revogações parciais.

#### Notas

* A tabela `SCHEMATA_EXTENSIONS` complementa a tabela `SCHEMATA` com informações sobre as opções do esquema.

### 28.3.32 A tabela INFORMATION_SCHEMA SCHEMATA_EXTENSIONS

A tabela `SCHEMATA_EXTENSIONS` (disponível a partir do MySQL 8.0.22) complementa a tabela `SCHEMATA` com informações sobre as opções do esquema.

A tabela `SCHEMATA_EXTENSIONS` tem essas colunas:

* `CATALOG_NAME`

O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

* `SCHEMA_NAME`

O nome do esquema.

* `OPTIONS`

As opções para o esquema. Se o esquema for somente leitura, o valor contém `READ ONLY=1`. Se o esquema não for somente leitura, a opção `READ ONLY` não aparece.

#### Exemplo

```
mysql> ALTER SCHEMA mydb READ ONLY = 1;
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA_EXTENSIONS
       WHERE SCHEMA_NAME = 'mydb';
+--------------+-------------+-------------+
| CATALOG_NAME | SCHEMA_NAME | OPTIONS     |
+--------------+-------------+-------------+
| def          | mydb        | READ ONLY=1 |
+--------------+-------------+-------------+

mysql> ALTER SCHEMA mydb READ ONLY = 0;
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA_EXTENSIONS
       WHERE SCHEMA_NAME = 'mydb';
+--------------+-------------+---------+
| CATALOG_NAME | SCHEMA_NAME | OPTIONS |
+--------------+-------------+---------+
| def          | mydb        |         |
+--------------+-------------+---------+
```

#### Notas

* `SCHEMATA_EXTENSIONS` é uma tabela não padrão `INFORMATION_SCHEMA`.

### 28.3.33 A tabela INFORMATION_SCHEMA SCHEMA_PRIVILEGES

A tabela `SCHEMA_PRIVILEGES` fornece informações sobre privilégios de esquema (banco de dados). Ela obtém seus valores da tabela `mysql.db` do sistema.

A tabela `SCHEMA_PRIVILEGES` tem essas colunas:

* `GRANTEE`

O nome da conta à qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível do esquema; veja a Seção 15.7.1.6, "Declaração GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio de esquema detido pelo beneficiário.

* `IS_GRANTABLE`

`YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `SCHEMA_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```
SELECT ... FROM INFORMATION_SCHEMA.SCHEMA_PRIVILEGES

SHOW GRANTS ...
```

### 28.3.34 A tabela de estatísticas do esquema de informação_SCHEMA

A tabela `STATISTICS` fornece informações sobre índices de tabela.

As colunas em `STATISTICS` que representam estatísticas de tabela armazenam valores armazenados. A variável de sistema `information_schema_stats_expiry` define o período de tempo antes que as estatísticas de tabela armazenadas expirem. O padrão é de 86400 segundos (24 horas). Se não houver estatísticas armazenadas ou se as estatísticas tiverem expirado, as estatísticas são recuperadas dos motores de armazenamento ao fazer uma consulta às colunas de estatísticas de tabela. Para atualizar os valores armazenados a qualquer momento para uma tabela específica, use `ANALYZE TABLE`. Para sempre recuperar as estatísticas mais recentes diretamente dos motores de armazenamento, defina `information_schema_stats_expiry=0`. Para obter mais informações, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION_SCHEMA”.

Nota

Se a variável de sistema `innodb_read_only` estiver habilitada, [[PH_LNK_1183]](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") pode falhar, pois não consegue atualizar as tabelas de estatísticas no dicionário de dados, que utilizam `InnoDB`. Para as operações de `ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") que atualizam a distribuição de chaves, a falha pode ocorrer mesmo que a operação atualize a própria tabela (por exemplo, se for uma tabela de `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

A tabela `STATISTICS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela que contém o índice pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela que contém o índice pertence.

* `TABLE_NAME`

O nome da tabela que contém o índice.

* `NON_UNIQUE`

0 se o índice não pode conter duplicatas, 1 se pode.

* `INDEX_SCHEMA`

O nome do esquema (banco de dados) ao qual o índice pertence.

* `INDEX_NAME`

O nome do índice. Se o índice for a chave primária, o nome é sempre `PRIMARY`.

* `SEQ_IN_INDEX`

O número de sequência da coluna no índice, começando com 1.

* `COLUMN_NAME`

O nome da coluna. Veja também a descrição para a coluna `EXPRESSION`.

* `COLLATION`

Como a coluna é ordenada no índice. Isso pode ter valores `A` (crescente), `D` (decrescente) ou `NULL` (não ordenado).

* `CARDINALITY`

Uma estimativa do número de valores únicos no índice. Para atualizar esse número, execute `ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") ou (para as tabelas `MyISAM`), **myisamchk -a**.

`CARDINALITY` é contado com base em estatísticas armazenadas como inteiros, portanto, o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinalidade, maior a chance de o MySQL usar o índice ao realizar junções.

* `SUB_PART`

O prefixo do índice. Ou seja, o número de caracteres indexados se a coluna estiver apenas parcialmente indexada, `NULL` se toda a coluna estiver indexada.

Nota

Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas declarações de `CREATE TABLE`, (create-table.html "15.1.20 CREATE TABLE Statement"), `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em conta ao especificar um comprimento de prefixo para uma coluna de string não binária que utiliza um conjunto de caracteres multibyte.

Para informações adicionais sobre prefixos de índice, consulte a Seção 10.3.5, “Indeks de Coluna”, e a Seção 15.1.15, “Instrução CREATE INDEX”.

* `PACKED`

Indica como a chave é embalada. `NULL` se não for o caso.

* `NULLABLE`

Contém `YES` se a coluna pode conter valores de `NULL` e `''` se

* `INDEX_TYPE`

O método de índice utilizado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `COMMENT`

Informações sobre o índice não descritas em sua própria coluna, como `disabled`, se o índice estiver desativado.

* `INDEX_COMMENT`

Qualquer comentário fornecido para o índice com um atributo `COMMENT` quando o índice foi criado.

* `IS_VISIBLE`

Se o índice é visível para o otimizador. Veja a Seção 10.3.12, “Índices Invisíveis”.

* `EXPRESSION`

O MySQL 8.0.13 e versões posteriores suportam partes de chave funcional (consulte Partes de Chave Funcional), o que afeta as colunas `COLUMN_NAME` e `EXPRESSION`:

+ Para uma parte da chave não funcional, `COLUMN_NAME` indica a coluna indexada pela parte da chave e `EXPRESSION` é `NULL`.

Para uma peça chave funcional, a coluna `COLUMN_NAME` é `NULL` e `EXPRESSION` indica a expressão para a peça chave.

#### Notas

* Não existe uma tabela padrão `INFORMATION_SCHEMA` para índices. A lista de colunas do MySQL é semelhante àquela que o SQL Server 2000 retorna para `sp_statistics`, exceto que `QUALIFIER` e `OWNER` são substituídos por `CATALOG` e `SCHEMA`, respectivamente.

Informações sobre índices de tabela também estão disponíveis na declaração `SHOW INDEX`. Veja a Seção 15.7.7.22, “Declaração SHOW INDEX”. As seguintes declarações são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_name = 'tbl_name'
  AND table_schema = 'db_name'

SHOW INDEX
  FROM tbl_name
  FROM db_name
```

No MySQL 8.0.30 e versões posteriores, as informações sobre as colunas primárias invisíveis geradas são visíveis por padrão nesta tabela. Você pode ocultar essas informações definindo `show_gipk_in_create_table_and_information_schema = OFF`(server-system-variables.html#sysvar_show_gipk_in_create_table_and_information_schema). Para mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.

### 28.3.35 A tabela INFORMATION_SCHEMA ST_GEOMETRY_COLUMNS

A tabela `ST_GEOMETRY_COLUMNS` fornece informações sobre as colunas da tabela que armazenam dados espaciais. Esta tabela é baseada no padrão SQL/MM (ISO/IEC 13249-3), com as extensões indicadas. O MySQL implementa `ST_GEOMETRY_COLUMNS` como uma visão na tabela `INFORMATION_SCHEMA` `COLUMNS`.

A tabela `ST_GEOMETRY_COLUMNS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela que contém a coluna pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

* `TABLE_NAME`

O nome da tabela que contém a coluna.

* `COLUMN_NAME`

O nome da coluna.

* `SRS_NAME`

O nome do sistema de referência espacial (SRS).

* `SRS_ID`

O sistema de referência espacial ID (SRID).

* `GEOMETRY_TYPE_NAME`

O tipo de dados da coluna. Os valores permitidos são: `geometry`, `point`, `linestring`, `polygon`, `multipoint`, `multilinestring`, `multipolygon`, `geometrycollection`. Esta coluna é uma extensão do MySQL ao padrão.

### 28.3.36 A tabela INFORMATION_SCHEMA ST_SPATIAL_REFERENCE_SYSTEMS

A tabela `ST_SPATIAL_REFERENCE_SYSTEMS` fornece informações sobre os sistemas de referência espaciais (SRS) disponíveis para dados espaciais. Esta tabela é baseada no padrão SQL/MM (ISO/IEC 13249-3).

As entradas na tabela `ST_SPATIAL_REFERENCE_SYSTEMS` são baseadas no conjunto de dados do [European Petroleum Survey Group][(http://epsg.org)] (EPSG), exceto pelo SRID 0, que corresponde a um SRS especial usado no MySQL e que representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos. Para informações adicionais sobre SRSs, consulte a Seção 13.4.5, “Suporte ao Sistema de Referência Espacial”.

A tabela `ST_SPATIAL_REFERENCE_SYSTEMS` tem essas colunas:

* `SRS_NAME`

O nome do sistema de referência espacial. Esse valor é único.

* `SRS_ID`

O sistema de referência espacial com ID numérico. Esse valor é único.

Os valores de `SRS_ID` representam o mesmo tipo de valores que o SRID dos valores de geometria ou passados como argumento SRID para funções espaciais. O SRID 0 (o plano cartesiano sem unidade) é especial. É sempre um ID de sistema de referência espacial legal e pode ser usado em quaisquer cálculos em dados espaciais que dependem de valores SRID.

* `ORGANIZATION`

O nome da organização que definiu o sistema de coordenadas em que o sistema de referência espacial se baseia.

* `ORGANIZATION_COORDSYS_ID`

O ID numérico dado ao sistema de referência espacial pela organização que o definiu.

* `DEFINITION`

A definição do sistema de referência espacial. Os valores `DEFINITION` são valores WKT, representados conforme especificado no documento do [Consórcio de Geoespacial Abierto](http://www.opengeospatial.org) OGC 12-063r5(http://docs.opengeospatial.org/is/12-063r5/12-063r5.html).

A definição de SRS é analisada sob demanda quando as definições são necessárias por funções de SIG. As definições analisadas são armazenadas no cache do dicionário de dados para permitir a reutilização e evitar o sobrecarregamento da análise para cada declaração que precisa de informações de SRS.

* `DESCRIPTION`

A descrição do sistema de referência espacial.

#### Notas

As colunas `SRS_NAME`, `ORGANIZATION`, `ORGANIZATION_COORDSYS_ID` e `DESCRIPTION` contêm informações que podem ser de interesse para os usuários, mas elas não são utilizadas pelo MySQL.

#### Exemplo

```
mysql> SELECT * FROM ST_SPATIAL_REFERENCE_SYSTEMS
       WHERE SRS_ID = 4326\G
*************************** 1. row ***************************
                SRS_NAME: WGS 84
                  SRS_ID: 4326
            ORGANIZATION: EPSG
ORGANIZATION_COORDSYS_ID: 4326
              DEFINITION: GEOGCS["WGS 84",DATUM["World Geodetic System 1984",
                          SPHEROID["WGS 84",6378137,298.257223563,
                          AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],
                          PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],
                          UNIT["degree",0.017453292519943278,
                          AUTHORITY["EPSG","9122"]],
                          AXIS["Lat",NORTH],AXIS["Long",EAST],
                          AUTHORITY["EPSG","4326"]]
             DESCRIPTION:
```

Esta entrada descreve o SRS utilizado para sistemas GPS. Tem um nome (`SRS_NAME`) de WGS 84 e uma ID (`SRS_ID`) de 4326, que é a ID utilizada pelo [Grupo Europeu de Pesquisa de Petróleo](http://epsg.org) (EPSG).

Os valores `DEFINITION` para SRSs projetados e geográficos começam com `PROJCS` e `GEOGCS`, respectivamente. A definição para SRID 0 é especial e tem um valor vazio `DEFINITION`. A seguinte consulta determina quantas entradas na tabela `ST_SPATIAL_REFERENCE_SYSTEMS` correspondem a SRSs projetados, geográficos e outros, com base nos valores `DEFINITION`:

```
mysql> SELECT
         COUNT(*),
         CASE LEFT(DEFINITION, 6)
           WHEN 'PROJCS' THEN 'Projected'
           WHEN 'GEOGCS' THEN 'Geographic'
           ELSE 'Other'
         END AS SRS_TYPE
       FROM INFORMATION_SCHEMA.ST_SPATIAL_REFERENCE_SYSTEMS
       GROUP BY SRS_TYPE;
+----------+------------+
| COUNT(*) | SRS_TYPE   |
+----------+------------+
|        1 | Other      |
|     4668 | Projected  |
|      483 | Geographic |
+----------+------------+
```

Para permitir a manipulação das entradas do SRS armazenadas no dicionário de dados, o MySQL fornece essas instruções SQL:

* `CREATE SPATIAL REFERENCE SYSTEM`(create-spatial-reference-system.html "15.1.19 CREATE SPATIAL REFERENCE SYSTEM Statement"): Veja a Seção 15.1.19, “Declaração CREATE SPATIAL REFERENCE SYSTEM”. A descrição desta declaração inclui informações adicionais sobre os componentes do SRS.

* `DROP SPATIAL REFERENCE SYSTEM`: Veja a Seção 15.1.31, “Declaração de SISTEMA DE REFERÊNCIA ESPACIAL DROP”.

### 28.3.37 A tabela INFORMATION_SCHEMA ST_UNITS_OF_MEASURE

A tabela `ST_UNITS_OF_MEASURE` (disponível a partir do MySQL 8.0.14) fornece informações sobre as unidades aceitáveis para a função `ST_Distance()`.

A tabela `ST_UNITS_OF_MEASURE` tem essas colunas:

* `UNIT_NAME`

O nome da unidade.

* `UNIT_TYPE`

O tipo de unidade (por exemplo, `LINEAR`).

* `CONVERSION_FACTOR`

Um fator de conversão utilizado para cálculos internos.

* `DESCRIPTION`

Uma descrição da unidade.

### 28.3.38 A tabela INFORMATION_SCHEMA TABLES

A tabela `TABLES` fornece informações sobre as tabelas nos bancos de dados.

As colunas em `TABLES` que representam estatísticas de tabela armazenam valores cacheados. A variável de sistema `information_schema_stats_expiry` define o período de tempo antes que as estatísticas de tabela cacheadas expirem. O padrão é de 86400 segundos (24 horas). Se não houver estatísticas cacheadas ou se as estatísticas tiverem expirado, as estatísticas são recuperadas dos motores de armazenamento ao fazer uma consulta às colunas de estatísticas de tabela. Para atualizar os valores cacheados a qualquer momento para uma tabela específica, use `ANALYZE TABLE`. Para sempre recuperar as estatísticas mais recentes diretamente dos motores de armazenamento, defina `information_schema_stats_expiry` para `0`. Para obter mais informações, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION_SCHEMA”.

Nota

Se a variável de sistema `innodb_read_only` estiver habilitada, (analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") pode falhar porque não consegue atualizar as tabelas de estatísticas no dicionário de dados, que utilizam [[`InnoDB`]. Para as operações de `ANALYZE TABLE` que atualizam a distribuição de chaves, a falha pode ocorrer mesmo que a operação atualize a própria tabela (por exemplo, se for uma tabela de `MyISAM`. Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

A tabela `TABLES` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela.

* `TABLE_TYPE`

`BASE TABLE` para uma tabela, `VIEW` para uma visão ou `SYSTEM VIEW` para uma tabela `INFORMATION_SCHEMA`.

A tabela `TABLES` não lista as tabelas `TEMPORARY`.

* `ENGINE`

O mecanismo de armazenamento para a tabela. Veja o Capítulo 17, *O mecanismo de armazenamento InnoDB*, e o Capítulo 18, *Mecanismos de armazenamento alternativos*.

Para tabelas particionadas, `ENGINE` mostra o nome do motor de armazenamento usado por todas as partições.

* `VERSION`

Esta coluna não é usada. Com a remoção dos arquivos `.frm` no MySQL 8.0, esta coluna agora reporta um valor hardcoded de `10`, que é a última versão do arquivo `.frm` usada no MySQL 5.7.

* `ROW_FORMAT`

O formato de armazenamento em linha (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). Para as tabelas de `MyISAM`, `Dynamic` corresponde ao que o **myisamchk -dvv** reporta como `Packed`.

* `TABLE_ROWS`

O número de linhas. Algumas engines de armazenamento, como `MyISAM`, armazenam o contagem exata. Para outras engines de armazenamento, como `InnoDB`, esse valor é uma aproximação e pode variar do valor real em até 40% a 50%. Nesses casos, use `SELECT COUNT(*)` para obter uma contagem precisa.

`TABLE_ROWS` é `NULL` para as tabelas `INFORMATION_SCHEMA`.

Para as tabelas `InnoDB`, o número de linhas é apenas uma estimativa grosseira usada na otimização do SQL. (Isso também é verdadeiro se a tabela `InnoDB` estiver particionada.)

* `AVG_ROW_LENGTH`

O comprimento médio da linha.

* `DATA_LENGTH`

Para `MyISAM`, `DATA_LENGTH` é o comprimento do arquivo de dados, em bytes.

Para `InnoDB`, `DATA_LENGTH` é a quantidade aproximada de espaço alocada para o índice agrupado, em bytes. Especificamente, é o tamanho do índice agrupado, em páginas, multiplicado pelo tamanho da página `InnoDB`.

Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `MAX_DATA_LENGTH`

Para `MyISAM`, `MAX_DATA_LENGTH` é o comprimento máximo do arquivo de dados. Este é o número total de bytes de dados que podem ser armazenados na tabela, dado o tamanho do ponteiro de dados utilizado.

Não utilizada para `InnoDB`.

Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `INDEX_LENGTH`

Para `MyISAM`, `INDEX_LENGTH` é o comprimento do arquivo de índice, em bytes.

Para `InnoDB`, `INDEX_LENGTH` é a quantidade aproximada de espaço alocada para índices não agrupados, em bytes. Especificamente, é a soma dos tamanhos dos índices não agrupados, em páginas, multiplicada pelo tamanho da página `InnoDB`.

Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `DATA_FREE`

O número de bytes alocados, mas não utilizados.

As tabelas `InnoDB` relatam o espaço livre do espaço de tabelas ao qual a tabela pertence. Para uma tabela localizada no espaço de tabelas compartilhado, este é o espaço livre do espaço de tabelas compartilhado. Se você estiver usando vários espaços de tabelas e a tabela tenha seu próprio espaço de tabelas, o espaço livre é apenas para essa tabela. Espaço livre significa o número de bytes em extensões completamente livres, menos uma margem de segurança. Mesmo que o espaço livre seja exibido como 0, é possível inserir linhas, desde que novas extensões não precisem ser alocadas.

Para o NDB Cluster, `DATA_FREE` mostra o espaço alocado em disco para, mas não utilizado por, uma tabela ou fragmento de dados de disco. (O uso do recurso de dados em memória é relatado pela coluna `DATA_LENGTH`.)

Para tabelas particionadas, esse valor é apenas uma estimativa e pode não ser absolutamente correto. Um método mais preciso de obter essas informações, nesses casos, é consultar a tabela `INFORMATION_SCHEMA` `PARTITIONS`, conforme mostrado neste exemplo:

  ```
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

Para mais informações, consulte a Seção 28.3.21, “A tabela INFORMATION_SCHEMA PARTITIONS”.

* `AUTO_INCREMENT`

O próximo valor de `AUTO_INCREMENT`.

* `CREATE_TIME`

Quando a tabela foi criada.

* `UPDATE_TIME`

Quando a tabela foi atualizada pela última vez. Para alguns motores de armazenamento, esse valor é `NULL`. Mesmo com o modo de arquivo por tabela, cada tabela `InnoDB` em um arquivo `.ibd` separado, a mudança de buffer pode atrasar a escrita no arquivo de dados, então o tempo de modificação do arquivo é diferente do tempo da última inserção, atualização ou exclusão. Para `MyISAM`, o timestamp do arquivo de dados é usado; no entanto, no Windows, o timestamp não é atualizado por atualizações, então o valor é impreciso.

`UPDATE_TIME` exibe um valor de marca-passo para a última tabela `UPDATE`, `INSERT` ou `DELETE` realizada em tabelas `InnoDB` que não estão particionadas. Para MVCC, o valor de marca-passo reflete o tempo de `COMMIT`, que é considerado o último horário de atualização. Os timestamps não são persistidos quando o servidor é reiniciado ou quando a tabela é ejetada do cache do dicionário de dados `InnoDB`.

* `CHECK_TIME`

Quando a tabela foi verificada pela última vez. Nem todos os mecanismos de armazenamento são atualizados dessa vez, no caso, o valor é sempre `NULL`.

Para tabelas `InnoDB` particionadas, `CHECK_TIME` é sempre `NULL`.

* `TABLE_COLLATION`

A tabela de collation padrão. A saída não lista explicitamente o conjunto de caracteres padrão da tabela, mas o nome da collation começa com o nome do conjunto de caracteres.

* `CHECKSUM`

O valor do checksum ao vivo, se houver.

* `CREATE_OPTIONS`

Opções extras usadas com `CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement").

`CREATE_OPTIONS` mostra `partitioned` para uma tabela particionada.

Antes do MySQL 8.0.16, `CREATE_OPTIONS` exibe a cláusula `ENCRYPTION` especificada para tabelas criadas em espaços de tabela por arquivo. A partir do MySQL 8.0.16, ele exibe a cláusula de criptografia para espaços de tabela por arquivo se a tabela estiver criptografada ou se a criptografia especificada for diferente da criptografia do esquema. A cláusula de criptografia não é exibida para tabelas criadas em espaços de tabela gerais. Para identificar espaços de tabela por arquivo e gerais criptografados, consulte a coluna `INNODB_TABLESPACES` `ENCRYPTION`.

Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do motor de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `ROW_FORMAT`. `CREATE_OPTIONS` mostra o formato de linha que foi especificado na declaração [`CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement")].

Ao alterar o motor de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo motor de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o motor de armazenamento original, se necessário. A coluna `CREATE_OPTIONS` pode mostrar opções retidas.

* `TABLE_COMMENT`

O comentário usado ao criar a tabela (ou informações sobre o motivo pelo qual o MySQL não conseguiu acessar as informações da tabela).

#### Notas

* Para as tabelas `NDB`, a saída desta declaração mostra valores apropriados para as colunas `AVG_ROW_LENGTH` e `DATA_LENGTH`, com exceção de que as colunas `BLOB` não são consideradas.

* Para as tabelas de `NDB`, `DATA_LENGTH` inclui dados armazenados na memória principal; as colunas `MAX_DATA_LENGTH` e `DATA_FREE` se aplicam aos dados em disco.

* Para as tabelas de dados de disco do NDB Cluster, `MAX_DATA_LENGTH` mostra o espaço alocado para a parte de disco de uma tabela ou fragmento de dados de disco. (O uso do recurso de dados em memória é relatado pela coluna `DATA_LENGTH`.)

* Para as tabelas `MEMORY`, os valores `DATA_LENGTH`, `MAX_DATA_LENGTH` e `INDEX_LENGTH` aproximam o valor real da memória alocada. O algoritmo de alocação reserva memória em grandes quantidades para reduzir o número de operações de alocação.

* Quanto às visualizações, a maioria das colunas `TABLES` é 0 ou `NULL`, exceto que `TABLE_NAME` indica o nome da visualização, `CREATE_TIME` indica o tempo de criação e `TABLE_COMMENT` diz `VIEW`.

As informações sobre a tabela também estão disponíveis nas declarações `SHOW TABLE STATUS` e `SHOW TABLES`. Veja a Seção 15.7.7.38, “Declaração SHOW TABLE STATUS”, e a Seção 15.7.7.39, “Declaração SHOW TABLES”. As seguintes declarações são equivalentes:

```
SELECT
    TABLE_NAME, ENGINE, VERSION, ROW_FORMAT, TABLE_ROWS, AVG_ROW_LENGTH,
    DATA_LENGTH, MAX_DATA_LENGTH, INDEX_LENGTH, DATA_FREE, AUTO_INCREMENT,
    CREATE_TIME, UPDATE_TIME, CHECK_TIME, TABLE_COLLATION, CHECKSUM,
    CREATE_OPTIONS, TABLE_COMMENT
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW TABLE STATUS
  FROM db_name
  [LIKE 'wild']
```

As seguintes declarações são equivalentes:

```
SELECT
  TABLE_NAME, TABLE_TYPE
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW FULL TABLES
  FROM db_name
  [LIKE 'wild']
```

### 28.3.39 A tabela INFORMATION_SCHEMA TABLES_EXTENSIONS

A tabela `TABLES_EXTENSIONS` (disponível a partir do MySQL 8.0.21) fornece informações sobre os atributos da tabela definidos para motores de armazenamento primário e secundário.

Nota

A tabela `TABLES_EXTENSIONS` é reservada para uso futuro.

A tabela `TABLES_EXTENSIONS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela.

* `ENGINE_ATTRIBUTE`

Atributos da tabela definidos para o motor de armazenamento primário. Reservado para uso futuro.

* `SECONDARY_ENGINE_ATTRIBUTE`

Atributos da tabela definidos para o motor de armazenamento secundário. Reservado para uso futuro.

### 28.3.40 A tabela INFORMATION_SCHEMA TABLESPACES

Esta tabela não é usada. Ela é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Outras tabelas `INFORMATION_SCHEMA` podem fornecer informações relacionadas:

* Para `NDB`, a tabela `INFORMATION_SCHEMA` `FILES` fornece informações relacionadas ao espaço de tabela.

* Para `InnoDB`, as tabelas `INFORMATION_SCHEMA`, `INNODB_TABLESPACES` e `INNODB_DATAFILES` fornecem metadados do espaço de tabelas.

### 28.3.41 A tabela INFORMATION_SCHEMA TABLESPACES_EXTENSIONS

A tabela `TABLESPACES_EXTENSIONS` (disponível a partir do MySQL 8.0.21) fornece informações sobre os atributos do espaço de tabela definidos para os motores de armazenamento primário.

Nota

A tabela `TABLESPACES_EXTENSIONS` é reservada para uso futuro.

A tabela `TABLESPACES_EXTENSIONS` tem essas colunas:

* `TABLESPACE_NAME`

O nome do tablespace.

* `ENGINE_ATTRIBUTE`

Atributos do tablespace definidos para o motor de armazenamento primário. Reservado para uso futuro.

### 28.3.42 A tabela Tabela_CONSTRAINTS do esquema de informações_schema

A tabela `TABLE_CONSTRAINTS` descreve quais tabelas possuem restrições.

A tabela `TABLE_CONSTRAINTS` tem essas colunas:

* `CONSTRAINT_CATALOG`

O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

O nome da restrição.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela.

* `CONSTRAINT_TYPE`

O tipo de restrição. O valor pode ser `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, ou (a partir do MySQL 8.0.16) `CHECK`. Esta é uma coluna `CHAR` (não `ENUM`)

As informações do `UNIQUE` e `PRIMARY KEY` são as mesmas que as obtidas a partir da coluna `Key_name` no resultado do `SHOW INDEX`, quando a coluna `Non_unique` está em `0`.

* `ENFORCED`

Para as restrições de `CHECK`, o valor é `YES` ou `NO` para indicar se a restrição é aplicada. Para outras restrições, o valor é sempre `YES`.

Esta coluna foi adicionada no MySQL 8.0.16.

### 28.3.43 A tabela TABLE_CONSTRAINTS_EXTENSIONS do esquema de informações INFORMATION_SCHEMA

A tabela `TABLE_CONSTRAINTS_EXTENSIONS` (disponível a partir do MySQL 8.0.21) fornece informações sobre os atributos de restrição de tabela definidos para motores de armazenamento primário e secundário.

Nota

A tabela `TABLE_CONSTRAINTS_EXTENSIONS` é reservada para uso futuro.

A tabela `TABLE_CONSTRAINTS_EXTENSIONS` tem essas colunas:

* `CONSTRAINT_CATALOG`

O nome do catálogo ao qual a tabela pertence.

* `CONSTRAINT_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `CONSTRAINT_NAME`

O nome da restrição.

* `TABLE_NAME`

O nome da tabela.

* `ENGINE_ATTRIBUTE`

Atributos de restrição definidos para o motor de armazenamento primário. Reservado para uso futuro.

* `SECONDARY_ENGINE_ATTRIBUTE`

Atributos de restrição definidos para o motor de armazenamento secundário. Reservado para uso futuro.

### 28.3.44 A tabela TABLE_PRIVILEGES do esquema de informações INFORMATION_SCHEMA

A tabela `TABLE_PRIVILEGES` fornece informações sobre privilégios de tabela. Ela obtém seus valores da tabela do sistema `mysql.tables_priv`.

A tabela `TABLE_PRIVILEGES` tem essas colunas:

* `GRANTEE`

O nome da conta à qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da tabela; veja a Seção 15.7.1.6, "Declaração GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio de tabela mantido pelo beneficiário.

* `IS_GRANTABLE`

`YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `TABLE_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```
SELECT ... FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES

SHOW GRANTS ...
```

### 28.3.45 A tabela TRIGGERS do esquema de informações_schema

A tabela `TRIGGERS` fornece informações sobre gatilhos. Para ver informações sobre os gatilhos de uma tabela, você deve ter o privilégio `TRIGGER` para a tabela.

A tabela `TRIGGERS` tem essas colunas:

* `TRIGGER_CATALOG`

O nome do catálogo ao qual o gatilho pertence. Esse valor é sempre `def`.

* `TRIGGER_SCHEMA`

O nome do esquema (banco de dados) ao qual o gatilho pertence.

* `TRIGGER_NAME`

O nome do gatilho.

* `EVENT_MANIPULATION`

O evento desencadeador. Este é o tipo de operação na tabela associada para a qual o gatilho é ativado. O valor é `INSERT` (uma linha foi inserida), `DELETE` (uma linha foi excluída) ou `UPDATE` (uma linha foi modificada).

* `EVENT_OBJECT_CATALOG`, `EVENT_OBJECT_SCHEMA` e `EVENT_OBJECT_TABLE`

Como observado na Seção 27.3, “Usando gatilhos”, cada gatilho está associado exatamente a uma tabela. Essas colunas indicam o catálogo e o esquema (banco de dados) em que essa tabela ocorre, e o nome da tabela, respectivamente. O valor `EVENT_OBJECT_CATALOG` é sempre `def`.

* `ACTION_ORDER`

A posição ordinal da ação do gatilho na lista de gatilhos na mesma tabela com os mesmos valores de `EVENT_MANIPULATION` e `ACTION_TIMING`.

* `ACTION_CONDITION`

Esse valor é sempre `NULL`.

* `ACTION_STATEMENT`

O corpo do gatilho; ou seja, a declaração executada quando o gatilho é ativado. Este texto usa codificação UTF-8.

* `ACTION_ORIENTATION`

Esse valor é sempre `ROW`.

* `ACTION_TIMING`

Se o gatilho é ativado antes ou depois do evento desencadeador. O valor é `BEFORE` ou `AFTER`.

* `ACTION_REFERENCE_OLD_TABLE`

Esse valor é sempre `NULL`.

* `ACTION_REFERENCE_NEW_TABLE`

Esse valor é sempre `NULL`.

* `ACTION_REFERENCE_OLD_ROW` e `ACTION_REFERENCE_NEW_ROW`

Os identificadores de coluna antigos e novos, respectivamente. O valor `ACTION_REFERENCE_OLD_ROW` é sempre `OLD` e o valor `ACTION_REFERENCE_NEW_ROW` é sempre `NEW`.

* `CREATED`

A data e a hora em que o gatilho foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundos) para gatilhos.

* `SQL_MODE`

O modo SQL em vigor quando o gatilho foi criado e sob o qual o gatilho é executado. Para os valores permitidos, consulte a Seção 7.1.11, “Modos SQL do servidor”.

* `DEFINER`

A conta nomeada na cláusula `DEFINER` (frequentemente o usuário que criou o gatilho), no formato `'user_name'@'host_name'`.

* `CHARACTER_SET_CLIENT`

O valor da sessão da variável de sistema `character_set_client` quando o gatilho foi criado.

* `COLLATION_CONNECTION`

O valor da sessão da variável de sistema `collation_connection` quando o gatilho foi criado.

* `DATABASE_COLLATION`

A agregação do banco de dados com o qual o gatilho está associado.

#### Exemplo

O exemplo a seguir utiliza o gatilho `ins_sum`, definido na Seção 27.3, “Usando gatilhos”:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.TRIGGERS
       WHERE TRIGGER_SCHEMA='test' AND TRIGGER_NAME='ins_sum'\G
*************************** 1. row ***************************
           TRIGGER_CATALOG: def
            TRIGGER_SCHEMA: test
              TRIGGER_NAME: ins_sum
        EVENT_MANIPULATION: INSERT
      EVENT_OBJECT_CATALOG: def
       EVENT_OBJECT_SCHEMA: test
        EVENT_OBJECT_TABLE: account
              ACTION_ORDER: 1
          ACTION_CONDITION: NULL
          ACTION_STATEMENT: SET @sum = @sum + NEW.amount
        ACTION_ORIENTATION: ROW
             ACTION_TIMING: BEFORE
ACTION_REFERENCE_OLD_TABLE: NULL
ACTION_REFERENCE_NEW_TABLE: NULL
  ACTION_REFERENCE_OLD_ROW: OLD
  ACTION_REFERENCE_NEW_ROW: NEW
                   CREATED: 2018-08-08 10:10:12.61
                  SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                            NO_ZERO_IN_DATE,NO_ZERO_DATE,
                            ERROR_FOR_DIVISION_BY_ZERO,
                            NO_ENGINE_SUBSTITUTION
                   DEFINER: me@localhost
      CHARACTER_SET_CLIENT: utf8mb4
      COLLATION_CONNECTION: utf8mb4_0900_ai_ci
        DATABASE_COLLATION: utf8mb4_0900_ai_ci
```

Informações sobre gatilho também estão disponíveis na declaração `SHOW TRIGGERS`. Veja a Seção 15.7.7.40, “Declaração SHOW TRIGGERS”.

### 28.3.46 A tabela Tabela de ATITUDES_INFORMACIONAIS do USUÁRIO

A tabela `USER_ATTRIBUTES` (disponível a partir do MySQL 8.0.21) fornece informações sobre comentários de usuários e atributos de usuários. Ela obtém seus valores da tabela do sistema `mysql.user`.

A tabela `USER_ATTRIBUTES` tem essas colunas:

* `USER`

A porção do nome de usuário da conta para a qual o valor da coluna `ATTRIBUTE` se aplica.

* `HOST`

A parte do nome de host da conta para a qual o valor da coluna `ATTRIBUTE` se aplica.

* `ATTRIBUTE`

O comentário do usuário, o atributo do usuário ou ambos pertencentes à conta especificada pelas colunas `USER` e `HOST`. O valor está em notação de objeto JSON. Os atributos são mostrados exatamente como definidos usando as declarações [`CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement") e [`ALTER USER`(alter-user.html "15.7.1.1 ALTER USER Statement") com as opções `ATTRIBUTE` ou `COMMENT`. Um comentário é mostrado como um par chave-valor com `comment` como a chave. Para informações adicionais e exemplos, consulte Opções de Comentário e Atributo do CREATE USER.

#### Notas

* `USER_ATTRIBUTES` é uma tabela não padrão `INFORMATION_SCHEMA`.

* Para obter apenas o comentário do usuário para um usuário específico como uma string não citada, você pode usar uma consulta como esta:

  ```
  mysql> SELECT ATTRIBUTE->>"$.comment" AS Comment
      ->     FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
      ->     WHERE USER='bill' AND HOST='localhost';
  +-----------+
  | Comment   |
  +-----------+
  | A comment |
  +-----------+
  ```

Da mesma forma, você pode obter o valor não cotado para um atributo de usuário dado usando sua chave.

* Antes do MySQL 8.0.22, o conteúdo de `USER_ATTRIBUTES` é acessível por qualquer pessoa. A partir do MySQL 8.0.22, o conteúdo de `USER_ATTRIBUTES` é acessível da seguinte forma:

+ Todas as linhas são acessíveis se:

- O fio atual é um fio de replicação.
- O sistema de controle de acesso não foi inicializado (por exemplo, o servidor foi iniciado com a opção `--skip-grant-tables`).

- A conta atualmente autenticada possui o privilégio `UPDATE` ou `SELECT` para a tabela do sistema `mysql.user`.

- A conta atualmente autenticada possui os privilégios `CREATE USER` e `SYSTEM_USER`.

+ Caso contrário, a conta atualmente autenticada pode ver a linha daquela conta. Além disso, se a conta tiver o privilégio `CREATE USER`, mas não o privilégio `SYSTEM_USER`, ela pode ver linhas para todas as outras contas que não têm o privilégio `SYSTEM_USER`.

Para obter mais informações sobre a especificação de comentários e atributos de conta, consulte a Seção 15.7.1.3, “Instrução CREATE USER”.

### 28.3.47 A tabela INFORMATION_SCHEMA USER_PRIVILEGES

A tabela `USER_PRIVILEGES` fornece informações sobre privilégios globais. Ela obtém seus valores da tabela do sistema `mysql.user`.

A tabela `USER_PRIVILEGES` tem essas colunas:

* `GRANTEE`

O nome da conta à qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

O nome do catálogo. Esse valor é sempre `def`.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido a nível global; veja a Seção 15.7.1.6, "Declaração de GRANDE". Cada linha lista um único privilégio, portanto, há uma linha por privilégio global detido pelo beneficiário.

* `IS_GRANTABLE`

`YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `USER_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```
SELECT ... FROM INFORMATION_SCHEMA.USER_PRIVILEGES

SHOW GRANTS ...
```

### 28.3.48 A Tabela INFORMATION_SCHEMA VIEWS

A tabela `VIEWS` fornece informações sobre visualizações em bancos de dados. Você deve ter o privilégio `SHOW VIEW` para acessar esta tabela.

A tabela `VIEWS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a visualização pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a visão pertence.

* `TABLE_NAME`

O nome da vista.

* `VIEW_DEFINITION`

A declaração `SELECT` que fornece a definição da visão. Essa coluna tem a maioria do que você vê na coluna `Create Table` que a `SHOW CREATE VIEW` produz. Ignorar as palavras antes de `SELECT` e ignorar as palavras `WITH CHECK OPTION`. Suponha que a declaração original fosse:

  ```
  CREATE VIEW v AS
    SELECT s2,s1 FROM t
    WHERE s1 > 5
    ORDER BY s1
    WITH CHECK OPTION;
  ```

Então, a definição de visualização é a seguinte:

  ```
  SELECT s2,s1 FROM t WHERE s1 > 5 ORDER BY s1
  ```

* `CHECK_OPTION`

O valor do atributo `CHECK_OPTION`. O valor é um dos `NONE`, `CASCADE` ou `LOCAL`.

* `IS_UPDATABLE`

MySQL define uma bandeira, chamada de bandeira de atualizabilidade de visão, no momento `CREATE VIEW`. A bandeira é definida como `YES` (verdadeiro) se `UPDATE` e `DELETE` (e operações semelhantes) são legais para a visão. Caso contrário, a bandeira é definida como `NO` (falso). A coluna `IS_UPDATABLE` na tabela `VIEWS` exibe o status desta bandeira. Isso significa que o servidor sempre sabe se uma visão é atualizável.

Se uma visão não for atualizável, declarações como `UPDATE`, `DELETE` e `INSERT` são ilegais e são rejeitadas. (Mesmo que uma visão seja atualizável, pode não ser possível inseri-la nela; para detalhes, consulte a Seção 27.5.3, “Visões atualizáveis e inseríveis”.)

* `DEFINER`

A conta do usuário que criou a visualização, no formato `'user_name'@'host_name'`.

* `SECURITY_TYPE`

A vista `SQL SECURITY` característica. O valor é um dos `DEFINER` ou `INVOKER`.

* `CHARACTER_SET_CLIENT`

O valor de sessão da variável de sistema `character_set_client` quando a visualização foi criada.

* `COLLATION_CONNECTION`

O valor de sessão da variável de sistema `collation_connection` quando a visualização foi criada.

#### Notas

O MySQL permite diferentes configurações do `sql_mode` para indicar ao servidor o tipo de sintaxe SQL a ser suportado. Por exemplo, você pode usar o modo SQL `ANSI` para garantir que o MySQL interprete corretamente o operador de concatenação padrão SQL, a barra dupla (`||`), em suas consultas. Se você criar uma visão que concatene itens, pode se preocupar que alterar a configuração do `sql_mode` para um valor diferente de `ANSI` possa fazer com que a visão se torne inválida. Mas isso não é o caso. Independentemente de como você escreva uma definição de visão, o MySQL sempre a armazena da mesma maneira, em uma forma canônica. Aqui está um exemplo que mostra como o servidor altera um operador de concatenação de barra dupla para uma função `CONCAT()`:

```
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT VIEW_DEFINITION FROM INFORMATION_SCHEMA.VIEWS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 'v';
+----------------------------------+
| VIEW_DEFINITION                  |
+----------------------------------+
| select concat('a','b') AS `col1` |
+----------------------------------+
1 row in set (0.00 sec)
```

A vantagem de armazenar uma definição de visualização em forma canônica é que as alterações feitas posteriormente no valor de `sql_mode` não afetam os resultados da visualização. No entanto, uma consequência adicional é que os comentários anteriores a `SELECT` são removidos da definição pelo servidor.

### 28.3.49 A tabela INFORMATION_SCHEMA VIEW_ROUTINE_USAGE

A tabela `VIEW_ROUTINE_USAGE` (disponível a partir do MySQL 8.0.13) fornece acesso a informações sobre funções armazenadas usadas em definições de visualização. A tabela não lista informações sobre funções internas (nativas) ou funções carregáveis usadas nas definições.

Você pode ver informações apenas para visualizações para as quais você tem algum privilégio e apenas para funções para as quais você tem algum privilégio.

A tabela `VIEW_ROUTINE_USAGE` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a visualização pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a visão pertence.

* `TABLE_NAME`

O nome da vista.

* `SPECIFIC_CATALOG`

O nome do catálogo ao qual a função usada na definição da vista pertence. Esse valor é sempre `def`.

* `SPECIFIC_SCHEMA`

O nome do esquema (banco de dados) ao qual a função usada na definição da visualização pertence.

* `SPECIFIC_NAME`

O nome da função utilizada na definição da visualização.

### 28.3.50 A tabela INFORMATION_SCHEMA VIEW_TABLE_USAGE

A tabela `VIEW_TABLE_USAGE` (disponível a partir do MySQL 8.0.13) fornece acesso a informações sobre as tabelas e visualizações usadas nas definições de visualização.

Você pode ver informações apenas para visualizações para as quais você tem algum privilégio e apenas para tabelas para as quais você tem algum privilégio.

A tabela `VIEW_TABLE_USAGE` tem essas colunas:

* `VIEW_CATALOG`

O nome do catálogo ao qual a visualização pertence. Esse valor é sempre `def`.

* `VIEW_SCHEMA`

O nome do esquema (banco de dados) ao qual a visão pertence.

* `VIEW_NAME`

O nome da vista.

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela ou a visão utilizada na definição da visão pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela ou a visão utilizada na definição da visão pertence.

* `TABLE_NAME`

O nome da tabela ou consulta utilizada na definição da consulta.