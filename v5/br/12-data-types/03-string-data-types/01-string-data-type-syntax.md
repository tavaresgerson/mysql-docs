### 11.3.1 Sintaxe do Tipo de Dados String

Os tipos de dados de cadeia são `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `BLOB`, `TEXT`, `ENUM` e `SET`.

Em alguns casos, o MySQL pode alterar uma coluna de texto para um tipo diferente do especificado em uma instrução `CREATE TABLE` ou `ALTER TABLE`. Consulte a Seção 13.1.18.6, “Alterações Silenciosas de Especificação de Colunas”.

Para definições de colunas de cadeias de caracteres (`CHAR`, `VARCHAR` e o tipo `TEXT`), o MySQL interpreta as especificações de comprimento em unidades de caracteres. Para definições de colunas de cadeias binárias (`BINARY`, `VARBINARY` e os tipos `BLOB`), o MySQL interpreta as especificações de comprimento em unidades de bytes.

As definições de colunas para os tipos de dados de cadeias de caracteres `CHAR`, `VARCHAR`, os tipos `TEXT`, `ENUM`, `SET` e quaisquer sinônimos) podem especificar o conjunto de caracteres da coluna e a ordenação:

- `CHARACTER SET` especifica o conjunto de caracteres. Se desejar, um conjunto de ordenação para o conjunto de caracteres pode ser especificado com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Por exemplo:

  ```sql
  CREATE TABLE t
  (
      c1 VARCHAR(20) CHARACTER SET utf8,
      c2 TEXT CHARACTER SET latin1 COLLATE latin1_general_cs
  );
  ```

  Esta definição de tabela cria uma coluna chamada `c1` que tem um conjunto de caracteres de `utf8` com a collation padrão para esse conjunto de caracteres, e uma coluna chamada `c2` que tem um conjunto de caracteres de `latin1` e uma collation sensível a maiúsculas e minúsculas (_cs).

  As regras para atribuir o conjunto de caracteres e a ordenação quando o atributo `CHARACTER SET` ou `COLLATE` está ausente ou ambos estão ausentes são descritas na Seção 10.3.5, “Conjunto de caracteres da coluna e ordenação”.

  `CHARSET` é sinônimo de `CHARACTER SET`.

- Especificar o atributo `CHARACTER SET binary` para um tipo de dado de cadeia de caracteres faz com que a coluna seja criada como o tipo de dado de cadeia de caracteres binária correspondente: `CHAR` se torna `BINARY`, `VARCHAR` se torna `VARBINARY` e `TEXT` se torna `BLOB`. Para os tipos de dados `ENUM` e `SET`, isso não ocorre; eles são criados conforme declarados. Suponha que você especifique uma tabela usando essa definição:

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

- O atributo `BINARY` é uma extensão não padrão do MySQL que é uma abreviação para especificar a collation binária (_bin) do conjunto de caracteres da coluna (ou do conjunto de caracteres padrão da tabela, se nenhum conjunto de caracteres da coluna for especificado). Neste caso, a comparação e ordenação são baseadas em valores de código de caracteres numéricos. Suponha que você especifique uma tabela usando esta definição:

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

- O atributo `ASCII` é uma abreviação para `CHARACTER SET latin1`.

- O atributo `UNICODE` é uma abreviação para `CHARACTER SET ucs2`.

A comparação e ordenação de colunas de caracteres são baseadas na collation atribuída à coluna. Para os tipos de dados `CHAR`, `VARCHAR`, `TEXT`, `ENUM` e `SET`, você pode declarar uma coluna com uma collation binária (_bin) ou o atributo BINARY para fazer com que a comparação e ordenação usem os valores subjacentes dos códigos de caracteres em vez de uma ordem lexical.

Para obter informações adicionais sobre o uso de conjuntos de caracteres no MySQL, consulte o Capítulo 10, *Conjunto de caracteres, Colagens, Unicode*.

- `[NACIONAIS] CHAR[(M)] [CARACTERE SET charset_name] [ORDENAÇÃO COLLATE collation_name]`

  Uma string de comprimento fixo que sempre é preenchida com espaços à direita até o comprimento especificado ao ser armazenada. *`M`* representa o comprimento da coluna em caracteres. O intervalo de *`M`* é de 0 a 255. Se *`M`* for omitido, o comprimento é 1.

  Nota

  Os espaços em branco finais são removidos quando os valores `CHAR` são recuperados, a menos que o modo SQL `PAD_CHAR_TO_FULL_LENGTH` esteja habilitado.

  `CHAR` é uma abreviação para `CHARACTER`. `NATIONAL CHAR` (ou sua forma abreviada equivalente, `NCHAR`) é a maneira padrão do SQL para definir que uma coluna `CHAR` deve usar algum conjunto de caracteres pré-definido. O MySQL usa `utf8` como este conjunto de caracteres pré-definido. Seção 10.3.7, “O Conjunto de Caracteres Nacional”.

  O tipo de dados `CHAR BYTE` é um alias para o tipo de dados `BINARY`. Esse é um recurso de compatibilidade.

  O MySQL permite que você crie uma coluna do tipo `CHAR(0)`. Isso é útil principalmente quando você precisa ser compatível com aplicações antigas que dependem da existência de uma coluna, mas que na verdade não usam seu valor. `CHAR(0)` também é bastante útil quando você precisa de uma coluna que pode ter apenas dois valores: uma coluna definida como `CHAR(0) NULL` ocupa apenas um bit e pode ter apenas os valores `NULL` e `''` (a string vazia).

- `[NACIONAIS] VARCHAR(M) [SET DE CARACTERES charset_name] [COLATAÇÃO collation_name]`

  Uma string de comprimento variável. *`M`* representa o comprimento máximo da coluna em caracteres. O intervalo de *`M`* é de 0 a 65.535. O comprimento máximo efetivo de um `VARCHAR` está sujeito ao tamanho máximo da linha (65.535 bytes, que é compartilhado entre todas as colunas) e ao conjunto de caracteres usado. Por exemplo, caracteres `utf8` podem exigir até três bytes por caractere, então uma coluna `VARCHAR` que usa o conjunto de caracteres `utf8` pode ser declarada como um máximo de 21.844 caracteres. Veja a Seção 8.4.7, “Limites de Contagem de Colunas da Tabela e Tamanho da Linha”.

  O MySQL armazena valores `VARCHAR` como um prefixo de comprimento de 1 ou 2 bytes mais os dados. O prefixo de comprimento indica o número de bytes no valor. Uma coluna `VARCHAR` usa um byte de comprimento se os valores não exijam mais de 255 bytes, dois bytes de comprimento se os valores podem exigir mais de 255 bytes.

  Nota

  O MySQL segue a especificação padrão do SQL e **não** remove espaços finais dos valores `VARCHAR`.

  `VARCHAR` é uma abreviação de `CHARACTER VARYING`. `NATIONAL VARCHAR` é a maneira padrão do SQL para definir que uma coluna `VARCHAR` deve usar um conjunto de caracteres pré-definido. O MySQL usa `utf8` como este conjunto de caracteres pré-definido. A seção 10.3.7, “O Conjunto de Caracteres Nacional”. `NVARCHAR` é uma abreviação de `NATIONAL VARCHAR`.

- `BINARY[(M)]`

  O tipo `BINARY` é semelhante ao tipo `CHAR`, mas armazena cadeias de bytes binários em vez de cadeias de caracteres não binárias. Um comprimento opcional *`M`* representa o comprimento da coluna em bytes. Se omitido, *`M`* tem um valor padrão de 1.

- `VARBINARY(M)`

  O tipo `VARBINARY` é semelhante ao tipo `VARCHAR`, mas armazena cadeias de bytes binários em vez de cadeias de caracteres não binárias. *`M`* representa o comprimento máximo da coluna em bytes.

- `TINYBLOB`

  Uma coluna `BLOB` com um comprimento máximo de 255 (28 − 1) bytes. Cada valor `TINYBLOB` é armazenado usando um prefixo de comprimento de 1 byte que indica o número de bytes no valor.

- `TINYTEXT [NÚMERO_CARACTÉROS charset_name] [ORDENAÇÃO collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 255 (28 − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `TINYTEXT` é armazenado usando um prefixo de comprimento de 1 byte que indica o número de bytes no valor.

- `BLOB[(M)]`

  Uma coluna `BLOB` com um comprimento máximo de 65.535 (216 − 1) bytes. Cada valor `BLOB` é armazenado usando um prefixo de comprimento de 2 bytes que indica o número de bytes no valor.

  Para este tipo, pode ser fornecida uma comprimento opcional *`M`*. Se isso for feito, o MySQL cria a coluna como o menor tipo `BLOB` grande o suficiente para armazenar valores de comprimento \*`M` bytes.

- `TEXT[(M)] [SET DE CARACTERES charset_name] [ORDENAÇÃO collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 65.535 (216 − 1) bytes. O comprimento máximo efetivo é menor se o valor contiver caracteres multibytes. Cada valor `TEXT` é armazenado usando um prefixo de comprimento de 2 bytes que indica o número de bytes no valor.

  Para este tipo, pode ser fornecida uma comprimento opcional *`M`*. Se isso for feito, o MySQL cria a coluna como o menor tipo `TEXT` grande o suficiente para armazenar valores de comprimento *`M`*.

- `MEDIUMBLOB`

  Uma coluna `BLOB` com um comprimento máximo de 16.777.215 (224 − 1) bytes. Cada valor `MEDIUMBLOB` é armazenado usando um prefixo de comprimento de 3 bytes que indica o número de bytes no valor.

- `MEDIUMTEXT [CHARSET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 16.777.215 (224 − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `MEDIUMTEXT` é armazenado usando um prefixo de comprimento de 3 bytes que indica o número de bytes no valor.

- `LONGBLOB`

  Uma coluna `BLOB` com um comprimento máximo de 4.294.967.295 ou 4 GB (232 − 1) bytes. O comprimento máximo efetivo das colunas `LONGBLOB` depende do tamanho máximo do pacote configurado no protocolo cliente/servidor e da memória disponível. Cada valor `LONGBLOB` é armazenado usando um prefixo de comprimento de 4 bytes que indica o número de bytes no valor.

- `LONGTEXT [CHARSET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 4.294.967.295 ou 4 GB (232 − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. O comprimento máximo efetivo das colunas `LONGTEXT` também depende do tamanho máximo do pacote configurado no protocolo cliente/servidor e da memória disponível. Cada valor `LONGTEXT` é armazenado usando um prefixo de comprimento de 4 bytes que indica o número de bytes no valor.

- `ENUM('valor1', 'valor2',...) [CARACTERES charset_nome] [COLLATE collation_nome]`

  Uma enumeração. Um objeto de string que pode ter apenas um valor, escolhido da lista de valores `'value1'`, `'value2'`, `...`, `NULL` ou o valor especial `''` de erro. Os valores `ENUM` são representados internamente como inteiros.

  Uma coluna `ENUM` pode ter no máximo 65.535 elementos distintos. (O limite prático é inferior a 3000.) Uma tabela não pode ter mais do que 255 definições de listas de elementos únicos entre suas colunas `ENUM` e `SET`, consideradas como um grupo. Para obter mais informações sobre esses limites, consulte Limites impostos pela estrutura do arquivo .frm.

- `SET('valor1', 'valor2',...) [SET DE caractere charset_name] [ORDENAÇÃO collation_name]`

  Um conjunto. Um objeto de string que pode ter zero ou mais valores, cada um dos quais deve ser escolhido da lista de valores `'value1'`, `'value2'`, `...` Os valores `SET` são representados internamente como inteiros.

  Uma coluna `SET` pode ter no máximo 64 membros distintos. Uma tabela não pode ter mais do que 255 definições de listas de elementos únicos entre suas colunas `ENUM` e `SET`, consideradas como um grupo. Para obter mais informações sobre esse limite, consulte Limites impostos pela estrutura do arquivo .frm.
