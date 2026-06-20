## 11.3 Tipos de dados de cadeia

Os tipos de dados de cadeia são `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `BLOB`, `TEXT`, `ENUM` e `SET`.

Para informações sobre os requisitos de armazenamento dos tipos de dados de cadeia, consulte a Seção 11.7, “Requisitos de Armazenamento do Tipo de Dados”.

Para descrições de funções que operam em valores de cadeia, consulte a Seção 12.8, “Funções e Operadores de Cadeia”.

### 11.3.1 Sintaxe do tipo de dados de cadeia de caracteres

Os tipos de dados de cadeia são `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `BLOB`, `TEXT`, `ENUM` e `SET`.

Em alguns casos, o MySQL pode alterar uma coluna de texto para um tipo diferente do que está especificado em uma declaração `CREATE TABLE` (create-table.html "13.1.18 CREATE TABLE Statement") ou `ALTER TABLE`. Veja a Seção 13.1.18.6, “Mudanças Silenciosas de Especificação de Coluna”.

Para definições de colunas de cadeias de caracteres (os tipos `CHAR`, `VARCHAR` e `TEXT`), o MySQL interpreta as especificações de comprimento em unidades de caracteres. Para definições de colunas de cadeias binárias (os tipos `BINARY`, `VARBINARY` e `BLOB`), o MySQL interpreta as especificações de comprimento em unidades de bytes.

As definições de coluna para tipos de dados de cadeia de caracteres `CHAR`, `VARCHAR`, os tipos `TEXT`, `ENUM`, `SET` e quaisquer sinônimos) podem especificar o conjunto de caracteres e a correção da coluna:

* `CHARACTER SET` especifica o conjunto de caracteres. Se desejar, uma ordenação para o conjunto de caracteres pode ser especificada com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Por exemplo:

  ```sql
  CREATE TABLE t
  (
      c1 VARCHAR(20) CHARACTER SET utf8,
      c2 TEXT CHARACTER SET latin1 COLLATE latin1_general_cs
  );
  ```

Essa definição de tabela cria uma coluna chamada `c1` que tem um conjunto de caracteres de `utf8`, com a collation padrão para esse conjunto de caracteres, e uma coluna chamada `c2` que tem um conjunto de caracteres de `latin1` e uma collation sensível ao caso (`_cs`).

As regras para atribuir o conjunto de caracteres e a ordenação quando um ou ambos os atributos `CHARACTER SET` e `COLLATE` estão ausentes são descritas na Seção 10.3.5, “Conjunto de caracteres e ordenação da coluna”.

`CHARSET` é sinônimo de `CHARACTER SET`.

* Especificar o atributo `CHARACTER SET binary` para um tipo de dados de cadeia de caracteres faz com que a coluna seja criada como o tipo de dados correspondente de cadeia binária: `CHAR` se torna `BINARY`, `VARCHAR` se torna `VARBINARY` e `TEXT` se torna `BLOB`. Para os tipos de dados `ENUM` e `SET`, isso não ocorre; eles são criados conforme declarado. Suponha que você especifique uma tabela usando esta definição:

  ```sql
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET binary,
    c2 TEXT CHARACTER SET binary,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

A tabela resultante tem esta definição:

  ```sql
  CREATE TABLE t
  (
    c1 VARBINARY(10),
    c2 BLOB,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

* O atributo `BINARY` é uma extensão não padrão do MySQL que é uma abreviação para especificar a codificação binária (`_bin`) do conjunto de caracteres da coluna (ou do conjunto de caracteres padrão da tabela, se nenhum conjunto de caracteres da coluna for especificado). Neste caso, a comparação e ordenação são baseadas em valores de código de caracteres numéricos. Suponha que você especifique uma tabela usando esta definição:

  ```sql
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET latin1 BINARY,
    c2 TEXT BINARY
  ) CHARACTER SET utf8mb4;
  ```

A tabela resultante tem esta definição:

  ```sql
  CREATE TABLE t (
    c1 VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_bin,
    c2 TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
  ) CHARACTER SET utf8mb4;
  ```

* O atributo `ASCII` é uma abreviação para `CHARACTER SET latin1`.

* O atributo `UNICODE` é uma abreviação para `CHARACTER SET ucs2`.

A comparação e ordenação de colunas de caracteres são baseadas na collation atribuída à coluna. Para os tipos de dados `CHAR`, `VARCHAR`, `TEXT`, `ENUM` e `SET`, você pode declarar uma coluna com uma collation binária (`_bin`) ou o atributo `BINARY` para fazer com que a comparação e ordenação use os valores dos códigos de caracteres subjacentes, em vez de uma ordem lexical.

Para obter informações adicionais sobre o uso de conjuntos de caracteres no MySQL, consulte o Capítulo 10, * Conjuntos de caracteres, Colagens, Unicode *.

* `[NATIONAL] CHAR[(M)] [CHARACTER SET charset_name] [COLLATE collation_name]`

Uma string de comprimento fixo que sempre é preenchida com espaços à direita até o comprimento especificado quando armazenada. *`M`* representa o comprimento da coluna em caracteres. A faixa de *`M`* é de 0 a 255. Se *`M`* for omitido, o comprimento é 1.

Nota

Os espaços finais são removidos quando os valores de `CHAR` são recuperados, a menos que o modo SQL `PAD_CHAR_TO_FULL_LENGTH` esteja habilitado.

`CHAR` é abreviação de `CHARACTER`. `NATIONAL CHAR` (ou sua forma abreviada equivalente, `NCHAR`) é a maneira padrão do SQL para definir que uma coluna `CHAR` deve usar algum conjunto de caracteres pré-definido. O MySQL usa `utf8` como este conjunto de caracteres pré-definido. Seção 10.3.7, “O Conjunto de Caracteres Nacional”.

O tipo de dados `CHAR BYTE` é um alias para o tipo de dados `BINARY`. Esse é um recurso de compatibilidade.

O MySQL permite que você crie uma coluna do tipo `CHAR(0)`. Isso é útil principalmente quando você precisa ser compatível com aplicações antigas que dependem da existência de uma coluna, mas que na verdade não usam seu valor. `CHAR(0)` também é bastante útil quando você precisa de uma coluna que pode ter apenas dois valores: Uma coluna que é definida como `CHAR(0) NULL` ocupa apenas um bit e pode ter apenas os valores `NULL` e `''` (a string vazia).

* `[NATIONAL] VARCHAR(M) [CHARACTER SET charset_name] [COLLATE collation_name]`

Uma string de comprimento variável. *`M`* representa o comprimento máximo da coluna em caracteres. A faixa de *`M`* é de 0 a 65.535. O comprimento máximo efetivo de um `VARCHAR` está sujeito ao tamanho máximo da string (65.535 bytes, que é compartilhado entre todas as colunas) e ao conjunto de caracteres utilizado. Por exemplo, os caracteres de `utf8` podem exigir até três bytes por caractere, então uma coluna de `VARCHAR` que utiliza o conjunto de caracteres de `utf8` pode ser declarada como um máximo de 21.844 caracteres. Veja a Seção 8.4.7, “Limites no Número de Colunas da Tabela e Tamanho da String”.

MySQL armazena os valores `VARCHAR` como um prefixo de comprimento de 1 byte ou 2 bytes mais dados. O prefixo de comprimento indica o número de bytes no valor. Uma coluna `VARCHAR` usa um byte de comprimento se os valores não exigirem mais de 255 bytes, dois bytes de comprimento se os valores podem exigir mais de 255 bytes.

Nota

O MySQL segue a especificação padrão do SQL e *não* remove espaços finais dos valores de `VARCHAR`.

`VARCHAR` é abreviação de `CHARACTER VARYING`. `NATIONAL VARCHAR` é a maneira padrão de SQL para definir que uma coluna `VARCHAR` deve usar algum conjunto de caracteres pré-definido. O MySQL usa `utf8` como este conjunto de caracteres pré-definido. Seção 10.3.7, “O Conjunto de Caracteres Nacional”. `NVARCHAR` é abreviação de `NATIONAL VARCHAR`.

* `BINARY[(M)]`

O tipo `BINARY` é semelhante ao tipo `CHAR`, mas armazena cadeias de bytes binários em vez de cadeias de caracteres não binárias. Um comprimento opcional *`M`* representa o comprimento da coluna em bytes. Se omitido, *`M`* tem como padrão 1.

* `VARBINARY(M)`

O tipo `VARBINARY` é semelhante ao tipo `VARCHAR`, mas armazena cadeias de bytes binários em vez de cadeias de caracteres não binárias. *`M`* representa o comprimento máximo da coluna em bytes.

* `TINYBLOB`

Uma coluna `BLOB` com um comprimento máximo de 255 (28 − 1) bytes. Cada valor `TINYBLOB` é armazenado usando um prefixo de comprimento de 1 byte que indica o número de bytes no valor.

* `TINYTEXT [CHARACTER SET charset_name] [COLLATE collation_name]`(blob.html "11.3.4 The BLOB and TEXT Types")

Uma coluna `TEXT` com um comprimento máximo de 255 (28 − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `TINYTEXT` é armazenado usando um prefixo de comprimento de 1 byte que indica o número de bytes no valor.

* `BLOB[(M)]`

Uma coluna `BLOB` com um comprimento máximo de 65.535 (216 − 1) bytes. Cada valor `BLOB` é armazenado usando um prefixo de comprimento de 2 bytes que indica o número de bytes no valor.

Para este tipo, pode ser fornecida uma comprimento opcional *`M`*. Se isso for feito, o MySQL cria a coluna como o menor tipo `BLOB` grande o suficiente para conter valores de *`M`* bytes de comprimento.

* `TEXT[(M)] [CHARACTER SET charset_name] [COLLATE collation_name]`(blob.html "11.3.4 The BLOB and TEXT Types")

Uma coluna `TEXT` com um comprimento máximo de 65.535 (216 − 1) bytes. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `TEXT` é armazenado usando um prefixo de comprimento de 2 bytes que indica o número de bytes no valor.

Para este tipo, pode ser fornecida uma comprimento opcional *`M`*. Se isso for feito, o MySQL cria a coluna como o tipo de tamanho `TEXT` menor o suficiente para conter valores de comprimento *`M`*.

* `MEDIUMBLOB`

Uma coluna `BLOB` com um comprimento máximo de 16.777.215 (224 − 1) bytes. Cada valor `MEDIUMBLOB` é armazenado usando um prefixo de comprimento de 3 bytes que indica o número de bytes no valor.

* `MEDIUMTEXT [CHARACTER SET charset_name] [COLLATE collation_name]`(blob.html "11.3.4 The BLOB and TEXT Types")

Uma coluna `TEXT` com um comprimento máximo de 16.777.215 (224 − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `MEDIUMTEXT` é armazenado usando um prefixo de comprimento de 3 bytes que indica o número de bytes no valor.

* `LONGBLOB`

Uma coluna `BLOB` com um comprimento máximo de 4.294.967.295 ou 4 GB (232 - 1) bytes. O comprimento máximo efetivo das colunas `LONGBLOB` depende do tamanho máximo do pacote configurado no protocolo cliente/servidor e da memória disponível. Cada valor `LONGBLOB` é armazenado usando um prefixo de comprimento de 4 bytes que indica o número de bytes no valor.

* `LONGTEXT [CHARACTER SET charset_name] [COLLATE collation_name]`(blob.html "11.3.4 The BLOB and TEXT Types")

Uma coluna `TEXT` com um comprimento máximo de 4.294.967.295 ou 4 GB (232 − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. O comprimento máximo efetivo das colunas `LONGTEXT` também depende do tamanho máximo do pacote configurado no protocolo cliente/servidor e da memória disponível. Cada valor `LONGTEXT` é armazenado usando um prefixo de comprimento de 4 bytes que indica o número de bytes no valor.

* `ENUM('value1','value2',...) [CHARACTER SET charset_name] [COLLATE collation_name]`(enum.html "11.3.5 The ENUM Type")

Uma enumeração. Um objeto de string que pode ter apenas um valor, escolhido da lista de valores `'value1'`, `'value2'`, `...`, `NULL` ou o valor especial de erro `''`. Os valores `ENUM` são representados internamente como inteiros.

Uma coluna `ENUM` pode ter no máximo 65.535 elementos distintos. (O limite prático é inferior a 3000.) Uma tabela não pode ter mais do que 255 definições de lista de elementos únicos entre suas colunas `ENUM` e `SET`, consideradas como um grupo. Para mais informações sobre esses limites, consulte Limites impostos pela estrutura do arquivo .frm.

* `SET('value1','value2',...) [CHARACTER SET charset_name] [COLLATE collation_name]`(set.html "11.3.6 The SET Type")

Um conjunto. Um objeto de cadeia que pode ter zero ou mais valores, cada um dos quais deve ser escolhido da lista de valores. Os valores `'value1'`, `'value2'`, `...` e `SET` são representados internamente como inteiros.

Uma coluna `SET` pode ter no máximo 64 membros distintos. Uma tabela não pode ter mais do que 255 definições de lista de elementos únicos entre seus colunas `ENUM` e `SET`, consideradas como um grupo. Para mais informações sobre esse limite, consulte Limites impostos pela estrutura do arquivo .frm.

### 11.3.2 Os tipos CHAR e VARCHAR

Os tipos `CHAR` e `VARCHAR` são semelhantes, mas diferem na forma como são armazenados e recuperados. Eles também diferem no comprimento máximo e no fato de que espaços finais são retidos.

Os tipos `CHAR` e `VARCHAR` são declarados com um comprimento que indica o número máximo de caracteres que você deseja armazenar. Por exemplo, `CHAR(30)` pode armazenar até 30 caracteres.

O comprimento de uma coluna `CHAR` é fixo ao comprimento que você declara ao criar a tabela. O comprimento pode ser qualquer valor de 0 a 255. Quando os valores de `CHAR` são armazenados, eles são preenchidos com espaços à direita até o comprimento especificado. Quando os valores de `CHAR` são recuperados, os espaços finais são removidos, a menos que o modo SQL `PAD_CHAR_TO_FULL_LENGTH` seja habilitado.

Os valores nas colunas `VARCHAR` são cadeias de caracteres de comprimento variável. O comprimento pode ser especificado como um valor de 0 a 65.535. O comprimento máximo efetivo de um `VARCHAR` está sujeito ao tamanho máximo da string (65.535 bytes, que é compartilhado entre todas as colunas) e ao conjunto de caracteres utilizado. Veja a Seção 8.4.7, “Limites sobre o Número de Colunas da Tabela e Tamanho da String”.

Em contraste com `CHAR`, os valores de `VARCHAR` são armazenados como um prefixo de comprimento de 1 byte ou 2 bytes mais dados. O prefixo de comprimento indica o número de bytes no valor. Uma coluna usa um byte de comprimento se os valores não exigirem mais de 255 bytes, dois bytes de comprimento se os valores podem exigir mais de 255 bytes.

Se o modo SQL rigoroso não estiver habilitado e você atribuir um valor a uma coluna `CHAR` ou `VARCHAR` que exceda o comprimento máximo da coluna, o valor é truncado para caber e um aviso é gerado. Para o truncamento de caracteres que não são espaços, você pode causar um erro (em vez de um aviso) e suprimir a inserção do valor usando o modo SQL rigoroso. Veja a Seção 5.1.10, “Modos SQL do servidor”.

Para as colunas `VARCHAR`, os espaços finais em excesso do comprimento da coluna são truncados antes da inserção e um aviso é gerado, independentemente do modo SQL em uso. Para as colunas `CHAR`, o truncamento dos espaços finais em excesso dos valores inseridos é realizado silenciosamente, independentemente do modo SQL.

Os valores de `VARCHAR` não são preenchidos quando armazenados. Espaços finais são mantidos quando os valores são armazenados e recuperados, de acordo com o SQL padrão.

A tabela a seguir ilustra as diferenças entre `CHAR` e `VARCHAR`, mostrando o resultado da armazenagem de vários valores de cadeia em colunas `CHAR(4)` e `VARCHAR(4)` (assumindo que a coluna utiliza um conjunto de caracteres de um byte, como `latin1`).

<table summary="Illustration of the difference between CHAR and VARCHAR storage requirements by showing the required storage for various string values in CHAR(4) and VARCHAR(4) columns."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 15%"/><col style="width: 20%"/><thead><tr> <th>Value</th> <th><code>CHAR(4)</code></th> <th>Storage Required</th> <th><code>VARCHAR(4)</code></th> <th>Storage Required</th> </tr></thead><tbody><tr> <th><code>''</code></th> <td><code>'    '</code></td> <td>4 bytes</td> <td><code>''</code></td> <td>1 byte</td> </tr><tr> <th><code>'ab'</code></th> <td><code>'ab  '</code></td> <td>4 bytes</td> <td><code>'ab'</code></td> <td>3 bytes</td> </tr><tr> <th><code>'abcd'</code></th> <td><code>'abcd'</code></td> <td>4 bytes</td> <td><code>'abcd'</code></td> <td>5 bytes</td> </tr><tr> <th><code>'abcdefgh'</code></th> <td><code>'abcd'</code></td> <td>4 bytes</td> <td><code>'abcd'</code></td> <td>5 bytes</td> </tr></tbody></table>

Os valores mostrados como armazenados na última string da tabela aplicam-se *apenas quando não se está usando o modo SQL rigoroso*; se o modo rigoroso estiver ativado, os valores que excedem o comprimento da coluna *não são armazenados* e ocorre um erro.

`InnoDB` codifica campos de comprimento fixo com comprimento igual ou superior a 768 bytes como campos de comprimento variável, que podem ser armazenados fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como é o caso de `utf8mb4`.

Se um valor específico for armazenado nas colunas `CHAR(4)` e `VARCHAR(4)`, os valores recuperados das colunas não são sempre os mesmos, pois os espaços finais são removidos das colunas `CHAR` durante a recuperação. O exemplo a seguir ilustra essa diferença:

```sql
mysql> CREATE TABLE vc (v VARCHAR(4), c CHAR(4));
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO vc VALUES ('ab  ', 'ab  ');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT CONCAT('(', v, ')'), CONCAT('(', c, ')') FROM vc;
+---------------------+---------------------+
| CONCAT('(', v, ')') | CONCAT('(', c, ')') |
+---------------------+---------------------+
| (ab  )              | (ab)                |
+---------------------+---------------------+
1 row in set (0.06 sec)
```

Os valores nas colunas `CHAR`, `VARCHAR` e `TEXT` são ordenados e comparados de acordo com a ordem de codificação do conjunto de caracteres atribuída à coluna.

Todas as colatões do MySQL são do tipo `PAD SPACE`. Isso significa que todos os valores `CHAR`, `VARCHAR` e `TEXT` são comparados sem considerar quaisquer espaços finais. A “comparação” neste contexto não inclui o operador de correspondência de padrões `LIKE`, para o qual os espaços finais são significativos. Por exemplo:

```sql
mysql> CREATE TABLE names (myname CHAR(10));
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO names VALUES ('Jones');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT myname = 'Jones', myname = 'Jones  ' FROM names;
+------------------+--------------------+
| myname = 'Jones' | myname = 'Jones  ' |
+------------------+--------------------+
|                1 |                  1 |
+------------------+--------------------+
1 row in set (0.00 sec)

mysql> SELECT myname LIKE 'Jones', myname LIKE 'Jones  ' FROM names;
+---------------------+-----------------------+
| myname LIKE 'Jones' | myname LIKE 'Jones  ' |
+---------------------+-----------------------+
|                   1 |                     0 |
+---------------------+-----------------------+
1 row in set (0.00 sec)
```

Isso não é afetado pelo modo SQL do servidor.

Nota

Para mais informações sobre os conjuntos de caracteres e colatinas do MySQL, consulte o Capítulo 10, *Conjunto de caracteres, colatinas, Unicode*. Para informações adicionais sobre os requisitos de armazenamento, consulte a Seção 11.7, “Requisitos de armazenamento do tipo de dados”.

Nos casos em que os caracteres finais de preenchimento são removidos ou as comparações os ignoram, se uma coluna tiver um índice que exige valores únicos, inserir valores na coluna que diferem apenas no número de caracteres finais de preenchimento resulta em um erro de chave duplicada. Por exemplo, se uma tabela contém `'a'`, uma tentativa de armazenar `'a '` causa um erro de chave duplicada.

### 11.3.3 Os tipos BINARY e VARBINARY

Os tipos `BINARY` e `VARBINARY` são semelhantes aos `CHAR` e `VARCHAR`, exceto que eles armazenam strings binárias em vez de strings não binárias. Isso significa que eles armazenam strings de byte em vez de strings de caracteres. Isso significa que eles têm o conjunto de caracteres e a correção `binary`, e a comparação e ordenação são baseadas nos valores numéricos dos bytes nos valores.

O comprimento máximo permitido é o mesmo para `BINARY` e `VARBINARY`, como para `CHAR` e `VARCHAR`, exceto que o comprimento para `BINARY` e `VARBINARY` é medido em bytes e não em caracteres.

Os tipos de dados `BINARY` e `VARBINARY` são distintos dos tipos de dados `CHAR BINARY` e `VARCHAR BINARY`. Para os tipos de dados `BINARY`, o atributo `_bin` não faz com que a coluna seja tratada como uma coluna de cadeia binária. Em vez disso, faz com que a collation binária (`latin1`) para o conjunto de caracteres da coluna (ou o conjunto de caracteres padrão da tabela, se nenhum conjunto de caracteres da coluna for especificado) seja usada, e a própria coluna armazena cadeias de caracteres não binárias em vez de cadeias de bytes binárias. Por exemplo, se o conjunto de caracteres padrão é `CHAR(5) BINARY`, `CHAR(5) CHARACTER SET latin1 COLLATE latin1_bin` é tratado como `BINARY(5)`. Isso difere de `binary`, que armazena cadeias binárias de 5 bytes que têm o conjunto de caracteres `binary` e collation. Para informações sobre as diferenças entre a collation `binary` da collation `_bin` dos conjuntos de caracteres não binários, consulte a Seção 10.8.5, “A collation binária em comparação com as collation \_bin”.

Se o modo SQL rigoroso não estiver habilitado e você atribuir um valor a uma coluna `BINARY` ou `VARBINARY` que excede o comprimento máximo da coluna, o valor é truncado para caber e um aviso é gerado. Para casos de truncação, para causar um erro (em vez de um aviso) e suprimir a inserção do valor, use o modo SQL rigoroso. Veja a Seção 5.1.10, “Modos SQL do servidor”.

Quando os valores de `BINARY` são armazenados, eles são preenchidos à direita com o valor de preenchimento até o comprimento especificado. O valor de preenchimento é `0x00` (o byte zero). Os valores são preenchidos à direita com `0x00` para inserções, e nenhum byte final é removido para recuperações. Todos os bytes são significativos em comparações, incluindo as operações de `ORDER BY` e `DISTINCT`. `0x00` e espaço diferem em comparações, com `0x00` sendo classificado antes do espaço.

Exemplo: Para uma coluna `BINARY(3)`, `'a '` se torna `'a \0'` quando inserida. `'a\0'` se torna `'a\0\0'` quando inserida. Ambos os valores inseridos permanecem inalterados para recuperações.

Para `VARBINARY`, não há preenchimento para inserções e nenhum byte é removido para recuperações. Todos os bytes são significativos em comparações, incluindo as operações de `ORDER BY` e `DISTINCT`. `0x00` e o espaço diferem em comparações, com `0x00` sendo classificado antes do espaço.

Nos casos em que os bytes finais de preenchimento são removidos ou as comparações os ignoram, se uma coluna tiver um índice que exige valores únicos, inserir valores na coluna que diferem apenas no número de bytes finais de preenchimento resulta em um erro de chave duplicada. Por exemplo, se uma tabela contém `'a'`, uma tentativa de armazenar [[`'a\0'`] causa um erro de chave duplicada.

Você deve considerar cuidadosamente as características de preenchimento e remoção anteriores se planeja usar o tipo de dados `BINARY` para armazenar dados binários e você exige que o valor recuperado seja exatamente o mesmo que o valor armazenado. O exemplo a seguir ilustra como o preenchimento `0x00` de valores `BINARY` afeta as comparações de valor da coluna:

```sql
mysql> CREATE TABLE t (c BINARY(3));
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO t SET c = 'a';
Query OK, 1 row affected (0.01 sec)

mysql> SELECT HEX(c), c = 'a', c = 'a\0\0' from t;
+--------+---------+-------------+
| HEX(c) | c = 'a' | c = 'a\0\0' |
+--------+---------+-------------+
| 610000 |       0 |           1 |
+--------+---------+-------------+
1 row in set (0.09 sec)
```

Se o valor recuperado deve ser o mesmo que o valor especificado para armazenamento sem preenchimento, pode ser preferível usar `VARBINARY` ou um dos tipos de dados `BLOB` em vez disso.

Nota

Dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

### 11.3.4 Os tipos BLOB e TEXTO

Um `BLOB` é um objeto grande binário que pode conter uma quantidade variável de dados. Os quatro tipos `BLOB` são `TINYBLOB`, `BLOB`, `MEDIUMBLOB` e `LONGBLOB`. Esses tipos diferem apenas na comprimento máximo dos valores que podem conter. Os quatro tipos `TEXT` são `TINYTEXT`, `TEXT`, `MEDIUMTEXT` e `LONGTEXT`. Esses correspondem aos quatro tipos `BLOB` e têm os mesmos comprimentos máximos e requisitos de armazenamento. Veja a Seção 11.7, “Requisitos de Armazenamento do Tipo de Dados”.

Os valores de `BLOB` são tratados como strings binárias (strings de bytes). Eles têm o conjunto de caracteres e a ordenação `binary`, e a comparação e ordenação são baseadas nos valores numéricos dos bytes nos valores das colunas. Os valores de `TEXT` são tratados como strings não binárias (strings de caracteres). Eles têm um conjunto de caracteres diferente de `binary`, e os valores são ordenados e comparados com base na ordenação do conjunto de caracteres.

Se o modo SQL rigoroso não estiver habilitado e você atribuir um valor a uma coluna `BLOB` ou `TEXT` que exceda o comprimento máximo da coluna, o valor é truncado para caber e um aviso é gerado. Para o truncamento de caracteres que não são espaços, você pode causar um erro (em vez de um aviso) e suprimir a inserção do valor usando o modo SQL rigoroso. Veja a Seção 5.1.10, “Modos SQL do servidor”.

A truncação de espaços finais excessivos dos valores a serem inseridos nas colunas do `TEXT` sempre gera um aviso, independentemente do modo SQL.

Para as colunas `TEXT` e `BLOB`, não há preenchimento na inserção e não há bytes removidos na seleção.

Se uma coluna `TEXT` estiver indexada, as comparações de entrada do índice são preenchidas com espaços no final. Isso significa que, se o índice exigir valores únicos, ocorrerão erros de chave duplicada para valores que diferem apenas no número de espaços finais. Por exemplo, se uma tabela contém `'a'`, uma tentativa de armazenar `'a '` causa um erro de chave duplicada. Isso não é verdade para as colunas `BLOB`.

Na maioria dos aspectos, você pode considerar uma coluna `BLOB` como uma coluna `VARBINARY` que pode ser do tamanho que você deseja. Da mesma forma, você pode considerar uma coluna `TEXT` como uma coluna `VARCHAR`. `BLOB` e `TEXT` diferem de `VARBINARY` e `VARCHAR` das seguintes maneiras:

* Para índices nas colunas `BLOB` e `TEXT`, você deve especificar o comprimento do prefixo do índice. Para `CHAR` e `VARCHAR`, um comprimento de prefixo é opcional. Veja a Seção 8.3.4, “Indeksos de Coluna”.

As colunas `BLOB` e `TEXT` não podem ter valores de `DEFAULT`.

Se você usar o atributo `BINARY` com um tipo de dados `TEXT`, a coluna é atribuída a collation binária (`_bin`) do conjunto de caracteres da coluna.

`LONG` e `LONG VARCHAR` correspondem ao tipo de dados `MEDIUMTEXT`. Esse é um recurso de compatibilidade.

O MySQL Connector/ODBC define os valores `BLOB` como `LONGVARBINARY` e os valores `TEXT` como `LONGVARCHAR`.

Como os valores de `BLOB` e `TEXT` podem ser extremamente longos, você pode encontrar algumas restrições ao usá-los:

* Apenas os primeiros `max_sort_length` bytes da coluna são utilizados na classificação. O valor padrão de `max_sort_length` é 1024. Você pode tornar mais bytes significativos na classificação ou agrupamento, aumentando o valor de `max_sort_length` no início ou durante o funcionamento do servidor. Qualquer cliente pode alterar o valor da variável de sessão `max_sort_length` do seu:

  ```sql
  mysql> SET max_sort_length = 2000;
  mysql> SELECT id, comment FROM t
      -> ORDER BY comment;
  ```

* Instâncias das colunas `BLOB` ou `TEXT` no resultado de uma consulta que é processada usando uma tabela temporária fazem com que o servidor use uma tabela em disco em vez de na memória, porque o mecanismo de armazenamento `MEMORY` não suporta esses tipos de dados (consulte Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”). O uso de disco acarreta uma penalidade de desempenho, então inclua as colunas `BLOB` ou [[PH_342]] no resultado da consulta apenas se elas realmente forem necessárias. Por exemplo, evite usar `SELECT *`, que seleciona todas as colunas.

* O tamanho máximo de um objeto `BLOB` ou `TEXT` é determinado por seu tipo, mas o maior valor que você realmente pode transmitir entre o cliente e o servidor é determinado pela quantidade de memória disponível e pelo tamanho dos buffers de comunicação. Você pode alterar o tamanho do buffer de mensagem alterando o valor da variável `max_allowed_packet`, mas você deve fazer isso tanto para o servidor quanto para seu programa de cliente. Por exemplo, o **mysql** e o **mysqldump** permitem que você altere o valor do `max_allowed_packet` do lado do cliente. Veja a Seção 5.1.1, “Configurando o Servidor”, a Seção 4.5.1, “mysql — O Cliente de String de Comando do MySQL”, e a Seção 4.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”. Você também pode querer comparar os tamanhos dos pacotes e o tamanho dos objetos de dados que você está armazenando com os requisitos de armazenamento, veja a Seção 11.7, “Requisitos de Armazenamento de Tipo de Dados”

Cada valor de `BLOB` ou `TEXT` é representado internamente por um objeto alocado separadamente. Isso contrasta com todos os outros tipos de dados, para os quais o armazenamento é alocado uma vez por coluna quando a tabela é aberta.

Em alguns casos, pode ser desejável armazenar dados binários, como arquivos de mídia, nas colunas `BLOB` ou `TEXT`. Você pode achar que as funções de manipulação de strings do MySQL são úteis para trabalhar com esses dados. Veja a Seção 12.8, “Funções e Operadores de String”. Por motivos de segurança e outros, geralmente é preferível fazer isso usando código de aplicativo em vez de dar ao usuário do aplicativo o privilégio `FILE`. Você pode discutir detalhes para várias linguagens e plataformas nos Fóruns do MySQL (<http://forums.mysql.com/>).

Nota

Dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

### 11.3.5 Tipo ENUM

Um `ENUM` é um objeto de string com um valor escolhido a partir de uma lista de valores permitidos que são enumerados explicitamente na especificação da coluna no momento da criação da tabela.

Consulte a Seção 11.3.1, “Sintaxe do Tipo de Dados de String”, para a sintaxe e limites de comprimento do tipo `ENUM`.

O tipo `ENUM` tem essas vantagens:

* Armazenamento de dados compacto em situações em que uma coluna tem um conjunto limitado de valores possíveis. As strings que você especifica como valores de entrada são automaticamente codificadas como números. Consulte a Seção 11.7, “Requisitos de Armazenamento de Tipo de Dados”, para os requisitos de armazenamento do tipo `ENUM`.

* Consultas e saída legíveis. Os números são traduzidos de volta para as strings correspondentes nos resultados das consultas.

e essas questões potenciais a serem consideradas:

* Se você criar valores de enumeração que pareçam números, é fácil confundir os valores literais com seus números de índice internos, conforme explicado nas Limitações de enumeração.

* O uso das colunas `ENUM` nas cláusulas `ORDER BY` requer cuidados especiais, conforme explicado na Ordenação de enumeração.

* Criando e usando colunas ENUM
* Valores de índice para literais de enumeração
* Tratamento de literais de enumeração
* Valores vazios ou NULL de enumeração
* Ordenação de enumeração
* Limitações de enumeração

#### Criando e Usando Colunas ENUM

Um valor de enumeração deve ser uma literal de string citada. Por exemplo, você pode criar uma tabela com uma coluna `ENUM` assim:

```sql
CREATE TABLE shirts (
    name VARCHAR(40),
    size ENUM('x-small', 'small', 'medium', 'large', 'x-large')
);
INSERT INTO shirts (name, size) VALUES ('dress shirt','large'), ('t-shirt','medium'),
  ('polo shirt','small');
SELECT name, size FROM shirts WHERE size = 'medium';
+---------+--------+
| name    | size   |
+---------+--------+
| t-shirt | medium |
+---------+--------+
UPDATE shirts SET size = 'small' WHERE size = 'large';
COMMIT;
```

Inserindo 1 milhão de strings nesta tabela com um valor de `'medium'`, seria necessário 1 milhão de bytes de armazenamento, em oposição a 6 milhões de bytes se você armazenasse a string real `'medium'` em uma coluna `VARCHAR`.

#### Valores do índice para literais de enumeração

Cada valor de enumeração tem um índice:

* Os elementos listados na especificação da coluna recebem números de índice, começando com 1.

* O valor do índice do valor de erro de string vazia é 0. Isso significa que você pode usar a seguinte declaração `SELECT` para encontrar strings nas quais valores inválidos de `ENUM` foram atribuídos:

  ```sql
  mysql> SELECT * FROM tbl_name WHERE enum_col=0;
  ```

* O índice do valor `NULL` é `NULL`.

* O termo "índice" aqui se refere a uma posição dentro da lista de valores de enumeração. Não tem nada a ver com índices de tabela.

Por exemplo, uma coluna especificada como `ENUM('Mercury', 'Venus', 'Earth')` pode ter qualquer um dos valores mostrados aqui. O índice de cada valor também é mostrado.

<table summary="Possible values for a column specified as ENUM('Mercury', 'Venus', 'Earth'). The table also shows the index of each value."><col style="width: 15%"/><col style="width: 15%"/><thead><tr> <th>Value</th> <th>Index</th> </tr></thead><tbody><tr> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <td><code>''</code></td> <td>0</td> </tr><tr> <td><code>'Mercury'</code></td> <td>1</td> </tr><tr> <td><code>'Venus'</code></td> <td>2</td> </tr><tr> <td><code>'Earth'</code></td> <td>3</td> </tr></tbody></table>

Uma coluna `ENUM` pode ter no máximo 65.535 elementos distintos. (O limite prático é inferior a 3.000.) Uma tabela não pode ter mais do que 255 definições de lista de elementos únicos entre suas colunas `ENUM` e `SET`, consideradas como um grupo. Para mais informações sobre esses limites, consulte Limites impostos pela estrutura do arquivo .frm.

Se você recuperar um valor de `ENUM` em um contexto numérico, o índice do valor da coluna é retornado. Por exemplo, você pode recuperar valores numéricos de uma coluna de `ENUM` da seguinte maneira:

```sql
mysql> SELECT enum_col+0 FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento em um número, se necessário. Para os valores de `ENUM`, o número de índice é usado no cálculo.

#### Manipulação de Literais de Enumeração

Os espaços em branco que se seguem são automaticamente excluídos dos valores dos membros `ENUM` na definição da tabela quando uma tabela é criada.

Quando recuperados, os valores armazenados em uma coluna `ENUM` são exibidos usando a letra maiúscula que foi usada na definição da coluna. Note que as colunas `ENUM` podem ser atribuídas a um conjunto de caracteres e uma correção de texto. Para coletas binárias ou sensíveis ao caso, a letra maiúscula é considerada ao atribuir valores à coluna.

Se você armazenar um número em uma coluna `ENUM`, o número é tratado como o índice para os possíveis valores, e o valor armazenado é o membro da enumeração com esse índice. (No entanto, isso *não* funciona com `LOAD DATA`, que trata todo o input como strings.) Se o valor numérico for citado, ele ainda é interpretado como um índice se não houver uma string correspondente na lista de valores da enumeração. Por essas razões, não é aconselhável definir uma coluna `ENUM` com valores de enumeração que se parecem com números, porque isso pode facilmente se tornar confuso. Por exemplo, a coluna a seguir tem membros da enumeração com valores de string de `'0'`, `'1'` e `'2'`, mas valores de índice numérico de `1`, `2` e `3`:

```sql
numbers ENUM('0','1','2')
```

Se você armazenar `2`, ele é interpretado como um valor de índice e se torna `'1'` (o valor com índice 2). Se você armazenar `'2'`, ele corresponde a um valor de enumeração, então ele é armazenado como `'2'`. Se você armazenar `'3'`, ele não corresponde a nenhum valor de enumeração, então ele é tratado como um índice e se torna `'2'` (o valor com índice 3).

```sql
mysql> INSERT INTO t (numbers) VALUES(2),('2'),('3');
mysql> SELECT * FROM t;
+---------+
| numbers |
+---------+
| 1       |
| 2       |
| 2       |
+---------+
```

Para determinar todos os valores possíveis para uma coluna `ENUM`, use [`SHOW COLUMNS FROM tbl_name LIKE 'enum_col'`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") e analise a definição de `ENUM` na coluna `Type` do resultado.

Na API C, os valores de `ENUM` são retornados como strings. Para obter informações sobre o uso do metadados do conjunto de resultados para distingui-los de outras strings, consulte a estrutura básica de dados da API C.

#### Valores de enumeração vazios ou NULL

Um valor de enumeração também pode ser a string vazia (`''`) ou `NULL` em certas circunstâncias:

* Se você inserir um valor inválido em um `ENUM` (ou seja, uma string que não está presente na lista de valores permitidos), a string vazia é inserida em vez disso como um valor de erro especial. Essa string pode ser distinguida de uma "normal" string vazia pelo fato de que essa string tem o valor numérico 0. Veja Valores de Índice para Literais de Enumeração para detalhes sobre os índices numéricos para os valores de enumeração.

Se o modo SQL rigoroso estiver habilitado, as tentativas de inserir valores inválidos de `ENUM` resultarão em um erro.

* Se uma coluna `ENUM` for declarada para permitir `NULL`, o valor da coluna `NULL` é um valor válido para a coluna, e o valor padrão é `NULL`. Se uma coluna `ENUM` for declarada `NOT NULL`, seu valor padrão é o primeiro elemento da lista de valores permitidos.

#### Ordenação de enumeração

Os valores de `ENUM` são ordenados com base em seus números de índice, que dependem da ordem em que os membros da enumeração foram listados na especificação da coluna. Por exemplo, `'b'` é ordenado antes de `'a'` para `ENUM('b', 'a')`. A string vazia é ordenada antes das strings não vazias, e os valores de `NULL` são ordenados antes de todos os outros valores da enumeração.

Para evitar resultados inesperados ao usar a cláusula `ORDER BY` em uma coluna `ENUM`, use uma dessas técnicas:

* Especifique a lista `ENUM` em ordem alfabética.

* Certifique-se de que a coluna esteja ordenada lexicamente e não por número de índice, codificando `ORDER BY CAST(col AS CHAR)` ou `ORDER BY CONCAT(col)`.

#### Limitações de enumeração

Um valor de enumeração não pode ser uma expressão, mesmo uma que se avalie a um valor de cadeia.

Por exemplo, essa declaração `CREATE TABLE` *não* funciona porque a função `CONCAT` não pode ser usada para construir um valor de enumeração:

```sql
CREATE TABLE sizes (
    size ENUM('small', CONCAT('med','ium'), 'large')
);
```

Você também não pode usar uma variável de usuário como um valor de enumeração. Esse par de declarações *não* funciona:

```sql
SET @mysize = 'medium';

CREATE TABLE sizes (
    size ENUM('small', @mysize, 'large')
);
```

Recomendamos fortemente que você *não* use números como valores de enumeração, porque isso não economiza armazenamento em relação ao tipo apropriado `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e é fácil confundir as strings e os valores numéricos subjacentes (que podem não ser os mesmos) se você citar os valores do `ENUM` incorretamente. Se você usar um número como um valor de enumeração, sempre o inclua entre aspas. Se as aspas forem omitidas, o número é considerado um índice. Veja o Tratamento de Literais de Enumeração para ver como até mesmo um número citado poderia ser usado erroneamente como um valor de índice numérico.

Valores duplicados na definição causam um aviso ou um erro se o modo SQL rigoroso estiver ativado.

### 11.3.6 O Tipo SET

Um `SET` é um objeto de string que pode ter zero ou mais valores, cada um dos quais deve ser escolhido de uma lista de valores permitidos especificados quando a tabela é criada. Os valores da coluna `SET` que consistem em vários membros do conjunto são especificados com membros separados por vírgulas (`,`). Uma consequência disso é que os valores dos membros `SET` não devem conter vírgulas.

Por exemplo, uma coluna especificada como `SET('one', 'two') NOT NULL` pode ter qualquer um desses valores:

```sql
''
'one'
'two'
'one,two'
```

Uma coluna `SET` pode ter no máximo 64 membros distintos. Uma tabela não pode ter mais do que 255 definições de lista de elementos únicos entre suas colunas `ENUM` e `SET`, consideradas como um grupo. Para mais informações sobre esse limite, consulte Limites impostos pela estrutura do arquivo .frm.

Valores duplicados na definição causam um aviso ou um erro se o modo SQL rigoroso estiver ativado.

Os espaços em branco que se seguem são automaticamente excluídos dos valores dos membros `SET` na definição da tabela quando uma tabela é criada.

Consulte os requisitos de armazenamento do tipo de cadeia de caracteres para os requisitos de armazenamento do tipo `SET`.

Consulte a Seção 11.3.1, “Sintaxe do Tipo de Dados de String”, para a sintaxe e limites de comprimento do tipo `SET`.

Quando recuperados, os valores armazenados em uma coluna `SET` são exibidos usando a letra maiúscula que foi usada na definição da coluna. Note que as colunas `SET` podem ser atribuídas a um conjunto de caracteres e uma ordenação. Para coletas binárias ou sensíveis ao caso, a letra maiúscula é considerada ao atribuir valores à coluna.

O MySQL armazena os valores `SET` numericamente, com o bit de menor ordem do valor armazenado correspondendo ao primeiro membro do conjunto. Se você recuperar um valor `SET` em um contexto numérico, o valor recuperado tem bits definidos correspondentes aos membros do conjunto que compõem o valor da coluna. Por exemplo, você pode recuperar valores numéricos de uma coluna `SET` assim:

```sql
mysql> SELECT set_col+0 FROM tbl_name;
```

Se um número for armazenado em uma coluna `SET`, os bits que estão definidos na representação binária do número determinam os membros do conjunto no valor da coluna. Para uma coluna especificada como `SET('a','b','c','d')`, os membros têm os seguintes valores decimais e binários.

<table summary="Decimal and binary values for members of a column specified as SET('a','b','c','d')."><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th><code>SET</code> Member</th> <th>Decimal Value</th> <th>Binary Value</th> </tr></thead><tbody><tr> <th><code>'a'</code></th> <td><code>1</code></td> <td><code>0001</code></td> </tr><tr> <th><code>'b'</code></th> <td><code>2</code></td> <td><code>0010</code></td> </tr><tr> <th><code>'c'</code></th> <td><code>4</code></td> <td><code>0100</code></td> </tr><tr> <th><code>'d'</code></th> <td><code>8</code></td> <td><code>1000</code></td> </tr></tbody></table>

Se você atribuir um valor de `9` a esta coluna, ou seja, `1001` em binário, então os primeiros e os quatro membros do valor `SET` `'a'` e `'d'` são selecionados e o valor resultante é `'a,d'`.

Para um valor que contém mais de um elemento `SET`, não importa a ordem em que os elementos são listados quando você insere o valor. Também não importa quantas vezes um elemento específico é listado no valor. Quando o valor é recuperado posteriormente, cada elemento no valor aparece uma vez, com elementos listados de acordo com a ordem em que foram especificados no momento da criação da tabela. Suponha que uma coluna seja especificada como `SET('a','b','c','d')`:

```sql
mysql> CREATE TABLE myset (col SET('a', 'b', 'c', 'd'));
```

Se você inserir os valores `'a,d'`, `'d,a'`, `'a,d,d'`, `'a,d,a'` e `'d,a,d'`:

```sql
mysql> INSERT INTO myset (col) VALUES
-> ('a,d'), ('d,a'), ('a,d,a'), ('a,d,d'), ('d,a,d');
Query OK, 5 rows affected (0.01 sec)
Records: 5  Duplicates: 0  Warnings: 0
```

Então, todos esses valores aparecem como `'a,d'` quando recuperados:

```sql
mysql> SELECT col FROM myset;
+------+
| col  |
+------+
| a,d  |
| a,d  |
| a,d  |
| a,d  |
| a,d  |
+------+
5 rows in set (0.04 sec)
```

Se você definir uma coluna `SET` para um valor não suportado, o valor é ignorado e uma mensagem de alerta é emitida:

```sql
mysql> INSERT INTO myset (col) VALUES ('a,d,d,s');
Query OK, 1 row affected, 1 warning (0.03 sec)

mysql> SHOW WARNINGS;
+---------+------+------------------------------------------+
| Level   | Code | Message                                  |
+---------+------+------------------------------------------+
| Warning | 1265 | Data truncated for column 'col' at row 1 |
+---------+------+------------------------------------------+
1 row in set (0.04 sec)

mysql> SELECT col FROM myset;
+------+
| col  |
+------+
| a,d  |
| a,d  |
| a,d  |
| a,d  |
| a,d  |
| a,d  |
+------+
6 rows in set (0.01 sec)
```

Se o modo SQL rigoroso estiver habilitado, as tentativas de inserir valores inválidos de `SET` resultarão em um erro.

Os valores de `SET` são ordenados numericamente. Os valores de `NULL` são ordenados antes dos valores não `NULL` de `SET`.

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento em um número, se necessário. Para os valores de `SET`, a operação de conversão faz com que o valor numérico seja usado.

Normalmente, você procura os valores de `SET` usando a função `FIND_IN_SET()` ou o operador `LIKE`:

```sql
mysql> SELECT * FROM tbl_name WHERE FIND_IN_SET('value',set_col)>0;
mysql> SELECT * FROM tbl_name WHERE set_col LIKE '%value%';
```

A primeira afirmação encontra strings onde *`set_col`* contém o membro do conjunto *`value`*. A segunda é semelhante, mas não a mesma: encontra strings onde *`set_col`* contém *`value`* em qualquer lugar, mesmo como uma subcadeia de outro membro do conjunto.

As seguintes declarações também são permitidas:

```sql
mysql> SELECT * FROM tbl_name WHERE set_col & 1;
mysql> SELECT * FROM tbl_name WHERE set_col = 'val1,val2';
```

O primeiro desses enunciados procura por valores que contenham o primeiro membro do conjunto. O segundo procura por uma correspondência exata. Tenha cuidado com as comparações do segundo tipo. Comparar os valores do conjunto com `'val1,val2'` retorna resultados diferentes do que comparar os valores com `'val2,val1'`. Você deve especificar os valores na mesma ordem em que eles estão listados na definição da coluna.

Para determinar todos os valores possíveis para uma coluna `SET`, use `SHOW COLUMNS FROM tbl_name LIKE set_col` e analise a definição de `SET` na coluna `Type` do resultado.

Na API C, os valores de `SET` são retornados como strings. Para obter informações sobre o uso do metadados do conjunto de resultados para distingui-los de outras strings, consulte a estrutura básica de dados da API C.