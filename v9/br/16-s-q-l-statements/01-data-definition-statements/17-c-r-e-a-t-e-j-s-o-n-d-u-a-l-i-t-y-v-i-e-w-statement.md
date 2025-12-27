### 15.1.17 Declaração de Visualização de Dualidade JSON

```
CREATE [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE}]
    [DEFINER = user]
    [SQL SECURITY {DEFINER | INVOKER}]
    JSON [RELATIONAL] DUALITY VIEW
    [IF NOT EXISTS] [schema_name.]view_name
    AS json_duality_select_statement

json_duality_select_statement:
    SELECT json_duality_object_expression
    FROM [schema_name.]root_table_name [AS table_alias]

json_duality_object_expression:
    JSON_DUALITY_OBJECT(...)
```

Esta declaração cria uma visualização de dualidade JSON com o nome *`view_name`*. O uso de `OR REPLACE` faz com que qualquer visualização de dualidade JSON existente com esse nome seja substituída por uma nova visualização de dualidade JSON com o mesmo nome. Especificar `IF NOT EXISTS` faz com que a criação da visualização seja tentada apenas se não houver uma visualização de dualidade JSON existente com o mesmo nome, em vez de retornar um erro.

As visualizações de dualidade JSON usam o mesmo namespace que as visualizações SQL. Isso significa que você não pode criar uma visualização de dualidade JSON com o mesmo nome que uma visualização SQL existente; também significa que você não pode criar uma visualização SQL com o mesmo nome que uma visualização de dualidade JSON existente. `CREATE OR REPLACE` não funciona para substituir uma visualização SQL por uma visualização de dualidade JSON, ou uma visualização de dualidade JSON por uma visualização SQL.

`DEFINER` e `SQL SECURITY` funcionam com essa declaração como fazem com `CREATE VIEW`. Para `ALGORITHM`, usar `TEMPTABLE` retorna um erro.

A palavra-chave `RELATIONAL` é opcional, não tem efeito e é omitida de nossos exemplos. *`schema_name`*, se usado com o nome da visualização, deve ser o nome de um esquema existente. Se o nome do esquema for omitido, a visualização de dualidade JSON é criada no esquema atual; se nenhum esquema estiver selecionado e nenhum for especificado, a declaração é rejeitada com um erro. *`schema_name`* e *`view_name`* devem seguir as regras para identificadores MySQL; consulte a Seção 11.2, “Nomes de Objetos de Esquema”, bem como a Seção 11.2.1, “Limites de Comprimento de Identificadores”, para informações sobre essas regras.

A cláusula `WITH ... CHECK OPTION` funciona com `CREATE JSON DUALITY VIEW` como faz com `CREATE VIEW`. Veja a descrição daquela declaração para mais informações.

*`json_duality_select_statement`* seleciona uma expressão de objeto JSON (*`json_duality_object_expression`*) construída usando colunas da tabela *`root_table_name`* no esquema *`schema_name`*. Se *`schema_name`* for omitido, o MySQL assume que a tabela está no esquema atual; se nenhum esquema for especificado e nenhum estiver selecionado atualmente, a declaração é rejeitada com um erro. Tanto *`schema_name`* quanto *`root_table_name`* devem seguir as regras habituais para identificadores do MySQL.

*`json_duality_select_statement`* deve conter uma e apenas uma expressão `JSON_DUALITY_OBJECT()` e uma cláusula `FROM`. Operações de conjunto (`UNION`, `INTERSECT`, `EXCEPT`) e expressões de tabela comuns (`WITH`)] não são suportadas. A cláusula `FROM` deve referenciar uma única tabela. As cláusulas `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`, `HAVING`, `WINDOW` e `LIMIT` não são suportadas.

*`json_duality_object_expression`* é um valor retornado por `JSON_DUALITY_OBJECT()`. Veja a descrição daquela função para obter informações sobre seus argumentos.

A função `JSON_DUALITY_OBJECT()` retorna um objeto de dualidade JSON para uso em `CREATE JSON DUALITY VIEW` ou `ALTER JSON DUALITY VIEW`. Tentar invocá-la em qualquer outro contexto resulta em um erro.

`JSON_DUALITY_OBJECT()` aceita um ou dois argumentos: uma expressão opcional de anotações de tabela e um conjunto de pares chave-valor no formato de objeto JSON.

Requisitos:

* Deve incluir uma chave chamada `_id` no objeto raiz representando a chave primária da tabela raiz. A ausência dessa chave resulta em um erro. Nenhuma subchave pode ser chamada de `_id`.

* Todas as tabelas participantes, incluindo a tabela raiz e quaisquer tabelas referenciadas dentro de *`nested_descendent_json_objects`* e *`singleton_descendent_json_object`*, devem ser tabelas base e ter uma chave primária.

* A projeção da tabela deve incluir a chave primária de cada tabela participante.

* As tabelas filhas que estão sendo projetadas podem estar relacionadas às tabelas pai de uma das duas maneiras:

  + Relação `PK - FK`: Se uma tabela filha estiver sendo projetada como *`singleton_descendent_json_object`*, a cláusula `WHERE` deve impor o formato `child_table.PK = parent_table.FK`. Se uma tabela filha estiver sendo projetada como *`nested_descendent_json_objects`*, a cláusula `WHERE` deve impor o formato `child_table.FK = parent_table.PK`.

  + Relação `PK - Qualquer Coluna`: Se uma tabela filha estiver sendo projetada como *`singleton_descendent_json_object`*, a cláusula `WHERE` deve impor o formato `child_table.PK = parent_table.any_column`. Se uma tabela filha estiver sendo projetada como *`nested_descendent_json_objects`*, a cláusula `WHERE` deve impor o formato `child_table.any_column = parent_table.PK`.

A sintaxe completa para os argumentos desta função é mostrada aqui, com notas adicionais a seguir:

```
table_annotations:
    WITH (table_annotation[, table_annotation]...)

table_annotation:
    INSERT | UPDATE | DELETE

json_duality_key_value_pairs:
    json_duality_key_value_pair[, json_duality_key_value_pair]...

json_duality_key_value_pair:
    key_name:value_expression

value_expression:
    column_name
    | (singleton_descendent_json_object)
    | (nested_descendent_json_objects)

singleton_descendent_json_object:
    SELECT json_duality_object_expression
    FROM child_table_name [AS table_alias]
    WHERE json_duality_join_condition

nested_descendent_json_objects:
    SELECT JSON_ARRAYAGG(json_duality_object_expression [json_constructor_null_clause])
    FROM child_table_name [AS table_alias]
    WHERE json_duality_join_condition

json_constructor_null_clause:
    NULL ON NULL | ABSENT ON NULL

json_duality_join_condition:
    [schema_name.]child_table_name.column_name
    = [schema_name.]parent_table_name.column_name

json_duality_object_expression:
    JSON_DUALITY_OBJECT(
        [table_annotations_expression] json_duality_key_value_pairs
    )
```

*`json_duality_key_value_pairs`* é um conjunto de pares chave-valor no formato *`key_name`:*`value_expression`*. Deve haver uma chave chamada `_id` no objeto raiz, e ela deve corresponder a uma coluna de chave primária da tabela sendo projetada; sub-chaves chamadas `_id` não são permitidas.

*`value_expression`* deve ser um dos seguintes: um nome de coluna; um objeto retornado por `JSON_DUALITY_OBJECT()` (filho singular); um objeto retornado por `JSON_ARRAYAGG()` (filho em árvore).

*`column_name`* deve referenciar uma coluna válida na tabela que está sendo projetada (*`root_table_name`* ou *`current_table_name`*). O mesmo *`column_name`* não pode ser usado mais de uma vez em uma única invocação de `JSON_DUALITY_OBJECT()`. Funções e operadores não podem ser usados com *`column_name`*. Colunas dos tipos `JSON`, `VECTOR` e `GEOMETRY` (incluindo todas as derivadas como `POINT`, `LINESTRING` e `POLYGON`) não são suportadas, assim como as colunas geradas. A coluna que tem a chave `_id` na tabela raiz para *`json_duality_key_value_pairs`* deve ser uma chave primária dessa tabela.

O *`singleton_descendent_json_object`* consiste em uma instrução `SELECT` com uma cláusula `FROM`. A lista de seleção e a cláusula `FROM` seguem as mesmas regras descritas para a consulta de nível superior em uma instrução `CREATE JSON DUALITY VIEW`.

*`nested_descendent_json_objects`* seleciona uma única expressão (*`json_duality_object_expression`*) usando `JSON_ARRAYAGG()`, que deve conter um `JSON_DUALITY_OBJECT()` não vazio. A lista de seleção e a cláusula `FROM` seguem as mesmas regras descritas para *`singleton_descendent_json_object`*. A cláusula opcional *`json_constructor_null_clause`* especifica o comportamento dessa função quando *`json_duality_object_expression`* é avaliado como `null`. Ela aceita qualquer um dos valores `ABSENT ON NULL` ou `NULL ON NULL` (o padrão). `NULL ON NULL` retorna o valor `null` JSON; `ABSENT ON NULL` faz com que o valor seja omitido da matriz JSON de saída.

*`singleton_descendent_json_object`* e *`nested_descendent_json_objects`* também suportam uma cláusula `WHERE`. Esta deve conter apenas uma expressão, com a forma mostrada aqui:

```
[schema_name.]child_table_name.column_name
    = [schema_name.]parent_table_name.column_name
```

Não são suportados outros tipos de condições além da igualdade. As múltiplas condições usando operadores `AND` ou `OR` também não são suportadas.

`JSON_DUALITY_OBJECT()` aceita uma expressão opcional *`table_annotations_expression`*. Essa expressão consiste em uma lista separada por vírgula que deve incluir os valores de anotação `INSERT`, `UPDATE` e `DELETE`, em qualquer ordem. Nenhum valor de anotação pode ser listado mais de uma vez. A função retorna uma maquete entre as colunas de *`table`* e a coleção JSON definida por *`json_duality_key_value_pairs`*. O valor usado com cada chave pode ser um dos três tipos:

* O nome de uma coluna em *`table`*. Isso deve ser apenas o nome da coluna e não pode ser uma expressão.

* Um *`singleton_descendent_json_object`* que consiste em um `SELECT` com uma cláusula `FROM`. A lista `SELECT` e a cláusula `FROM` seguem as mesmas regras descritas para a consulta de nível superior em `CREATE JSON DUALITY VIEW`.

* Um conjunto de *`nested_descendent_json_objects`* seleciona uma expressão usando `JSON_ARRAYAGG()`, que por sua vez contém `JSON_DUALITY_OBJECT()`.

Se a tabela for projetada várias vezes, o conjunto de colunas projetado deve ser consistente em todas as instâncias da projeção da tabela.

Veja a Seção 27.7, “Visões de Dualidade JSON”, para mais informações e exemplos.