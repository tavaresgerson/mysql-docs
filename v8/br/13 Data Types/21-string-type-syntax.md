### 13.3.1 Sintaxe do Tipo de Dados de Cadeia

Os tipos de dados de cadeia são `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `BLOB`, `TEXT`, `ENUM` e `SET`.

Em alguns casos, o MySQL pode alterar uma coluna de cadeia para um tipo diferente do especificado em uma instrução `CREATE TABLE` ou `ALTER TABLE`. Consulte a Seção 15.1.20.7, “Alterações Silenciosas de Especificação de Colunas”.

Para definições de colunas de cadeias de caracteres (tipos `CHAR`, `VARCHAR` e `TEXT`), o MySQL interpreta as especificações de comprimento em unidades de caracteres. Para definições de colunas de cadeias binárias (tipos `BINARY`, `VARBINARY` e `BLOB`), o MySQL interpreta as especificações de comprimento em unidades de bytes.

As definições de colunas para os tipos de dados de cadeia de caracteres `CHAR`, `VARCHAR`, os tipos `TEXT`, `ENUM`, `SET` e quaisquer sinônimos) podem especificar o conjunto de caracteres da coluna e a collation:

* `CHARACTER SET` especifica o conjunto de caracteres. Se desejado, uma collation para o conjunto de caracteres pode ser especificada com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Por exemplo:

  ```
  CREATE TABLE t
  (
      c1 VARCHAR(20) CHARACTER SET utf8mb4,
      c2 TEXT CHARACTER SET latin1 COLLATE latin1_general_cs
  );
  ```

  Esta definição de tabela cria uma coluna chamada `c1` que tem um conjunto de caracteres de `utf8mb4` com a collation padrão para esse conjunto de caracteres, e uma coluna chamada `c2` que tem um conjunto de caracteres de `latin1` e uma collation sensível a maiúsculas (`_cs`).

As regras para atribuir o conjunto de caracteres e a collation quando qualquer um ou ambos os atributos `CHARACTER SET` e `COLLATE` estão ausentes são descritas na Seção 12.3.5, “Conjunto de Caracteres e Collation da Coluna”.

`CHARSET` é um sinônimo de `CHARACTER SET`.
* Especificar o atributo `CHARACTER SET binary` para um tipo de dados de cadeia de caracteres faz com que a coluna seja criada como o tipo de dados de cadeia binária correspondente: `CHAR` se torna `BINARY`, `VARCHAR` se torna `VARBINARY` e `TEXT` se torna `BLOB`. Para os tipos de dados `ENUM` e `SET`, isso não ocorre; eles são criados conforme declarados. Suponha que você especifique uma tabela usando esta definição:

  ```
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET binary,
    c2 TEXT CHARACTER SET binary,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

  A tabela resultante tem esta definição:

```
  CREATE TABLE t
  (
    c1 VARBINARY(10),
    c2 BLOB,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```
* O atributo `BINARY` é uma extensão não padrão do MySQL que é uma abreviação para especificar a collation binária (`_bin`) do conjunto de caracteres da coluna (ou do conjunto de caracteres padrão da tabela, se nenhum conjunto de caracteres da coluna for especificado). Neste caso, a comparação e ordenação são baseadas em valores de código de caracteres numéricos. Suponha que você especifique uma tabela usando esta definição:

  ```
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET latin1 BINARY,
    c2 TEXT BINARY
  ) CHARACTER SET utf8mb4;
  ```

  A tabela resultante tem esta definição:

  ```
  CREATE TABLE t (
    c1 VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_bin,
    c2 TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
  ) CHARACTER SET utf8mb4;
  ```

  No MySQL 8.4, o atributo `BINARY` é desatualizado e você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL. As aplicações devem ser ajustadas para usar uma collation explícita `_bin` em vez disso.

  O uso de `BINARY` para especificar um tipo de dados ou conjunto de caracteres permanece inalterado.
* O atributo `ASCII` é uma abreviação para `CHARACTER SET latin1`. Suportado em versões mais antigas do MySQL, `ASCII` é desatualizado; use `CHARACTER SET` em vez disso.
* O atributo `UNICODE` é uma abreviação para `CHARACTER SET ucs2`. Suportado em versões mais antigas do MySQL, `UNICODE` é desatualizado; use `CHARACTER SET` em vez disso.

A comparação e ordenação de colunas de caracteres são baseadas na collation atribuída à coluna. Para os tipos de dados `CHAR`, `VARCHAR`, `TEXT`, `ENUM` e `SET`, você pode declarar uma coluna com uma collation binária (`_bin`) ou o atributo `BINARY` para fazer com que a comparação e ordenação usem os valores de código de caracteres subjacentes em vez de uma ordem lexical.

Para obter informações adicionais sobre o uso de conjuntos de caracteres no MySQL, consulte o Capítulo 12, *Conjunto de caracteres, collation, Unicode*.

* `[NATIONAL] CHAR[(M)] [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma string de comprimento fixo que é sempre preenchida com espaços à direita até o comprimento especificado ao ser armazenada. *`M`* representa o comprimento da coluna em caracteres. A faixa de *`M`* é de 0 a 255. Se *`M`* for omitido, o comprimento é 1.

  ::: info Nota

  Espaços finais são removidos quando os valores de `CHAR` são recuperados, a menos que o modo SQL `PAD_CHAR_TO_FULL_LENGTH` esteja habilitado.

`CHAR` é uma abreviação para `CHARACTER`. `NATIONAL CHAR` (ou sua forma abreviada equivalente, `NCHAR`) é a maneira padrão do SQL para definir que uma coluna `CHAR` deve usar algum conjunto de caracteres pré-definido. O MySQL usa `utf8mb3` como este conjunto de caracteres pré-definido. A seção 12.3.7, “O Conjunto de Caracteres Nacional”.

O tipo de dados `[NATIONAL] VARCHAR(M) [CHARACTER SET charset_name] [COLLATE collation_name]`

Uma string de comprimento variável. *`M`* representa o comprimento máximo da coluna em caracteres. O intervalo de *`M`* é de 0 a 65.535. O comprimento efetivo de um `VARCHAR` está sujeito ao tamanho máximo da linha (65.535 bytes, que é compartilhado entre todas as colunas) e ao conjunto de caracteres usado. Por exemplo, os caracteres `utf8mb3` podem exigir até três bytes por caractere, então uma coluna `VARCHAR` que usa o conjunto de caracteres `utf8mb3` pode ser declarada para ter um máximo de 21.844 caracteres. Veja a Seção 10.4.7, “Limites de Contagem de Colunas de Tabela e Tamanho da Linha”.

O MySQL armazena os valores de `VARCHAR` como um prefixo de comprimento de 1 ou 2 bytes mais dados. O prefixo de comprimento indica o número de bytes no valor. Uma coluna `VARCHAR` usa um byte de comprimento se os valores não exijam mais de 255 bytes, dois bytes de comprimento se os valores podem exigir mais de 255 bytes.

::: info Nota

O MySQL segue a especificação padrão do SQL e *não* remove espaços finais dos valores de `VARCHAR`.

`VARCHAR` é uma abreviação para `CHARACTER VARYING`. `NATIONAL VARCHAR` é a maneira padrão do SQL para definir que uma coluna `VARCHAR` deve usar um conjunto de caracteres pré-definido. O MySQL usa `utf8mb3` como este conjunto de caracteres pré-definido. A seção 12.3.7, “O Conjunto de Caracteres Nacional”. `NVARCHAR` é uma abreviação para `NATIONAL VARCHAR`.
*  `BINARY[(M)]`

  O  tipo `BINARY` é semelhante ao tipo `CHAR`, mas armazena cadeias de bytes binários em vez de cadeias de caracteres não binárias. Um comprimento opcional *`M`* representa o comprimento da coluna em bytes. Se omitido, *`M`* tem o valor padrão de 1.
*  `VARBINARY(M)`

  O  tipo `VARBINARY` é semelhante ao tipo `VARCHAR`, mas armazena cadeias de bytes binários em vez de cadeias de caracteres não binárias. *`M`* representa o comprimento máximo da coluna em bytes.
*  `TINYBLOB`

  Uma coluna `BLOB` com um comprimento máximo de 255 (28 − 1) bytes. Cada valor `TINYBLOB` é armazenado usando um prefixo de comprimento de 1 byte que indica o número de bytes no valor.
* `TINYTEXT [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 255 (28 − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `TINYTEXT` é armazenado usando um prefixo de comprimento de 1 byte que indica o número de bytes no valor.
*  `BLOB[(M)]`

  Uma coluna `BLOB` com um comprimento máximo de 65.535 (216 − 1) bytes. Cada valor `BLOB` é armazenado usando um prefixo de comprimento de 2 bytes que indica o número de bytes no valor.

  Um comprimento opcional *`M`* pode ser dado para este tipo. Se isso for feito, o MySQL cria a coluna como o menor tipo `BLOB` grande o suficiente para armazenar valores de *`M`* bytes de comprimento.
* `TEXT[(M)] [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 65.535 (216 − 1) bytes. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `TEXT` é armazenado usando um prefixo de comprimento de 2 bytes que indica o número de bytes no valor.

Um comprimento opcional *`M`* pode ser fornecido para este tipo. Se isso for feito, o MySQL cria a coluna como o menor tipo `TEXT` grande o suficiente para armazenar valores de comprimento *`M`* caracteres.
* `MEDIUMBLOB`

  Uma coluna `BLOB` com um comprimento máximo de 16.777.215 (224 − 1) bytes. Cada valor `MEDIUMBLOB` é armazenado usando um prefixo de comprimento de 3 bytes que indica o número de bytes no valor.
* `MEDIUMTEXT [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 16.777.215 (224 − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `MEDIUMTEXT` é armazenado usando um prefixo de comprimento de 3 bytes que indica o número de bytes no valor.
* `LONGBLOB`

  Uma coluna `BLOB` com um comprimento máximo de 4.294.967.295 ou 4GB (232 − 1) bytes. O comprimento máximo efetivo das colunas `LONGBLOB` depende do tamanho máximo do pacote configurado no protocolo cliente/servidor e da memória disponível. Cada valor `LONGBLOB` é armazenado usando um prefixo de comprimento de 4 bytes que indica o número de bytes no valor.
* `LONGTEXT [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 4.294.967.295 ou 4GB (232 − 1) caracteres. O comprimento máximo efetivo das colunas `LONGTEXT` também depende do tamanho máximo do pacote configurado no protocolo cliente/servidor e da memória disponível. Cada valor `LONGTEXT` é armazenado usando um prefixo de comprimento de 4 bytes que indica o número de bytes no valor.
* `ENUM('value1','value2',...) [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma enumeração. Um objeto de string que pode ter apenas um valor, escolhido da lista de valores `'value1'`, `'value2'`, `...`, `NULL` ou o valor especial `''` de erro. Os valores `ENUM` são representados internamente como inteiros.

  Uma coluna `ENUM` pode ter um máximo de 65.535 elementos distintos.

O comprimento máximo suportado de um elemento `ENUM` individual é *`M`* <= 255 e (*`M`* x *`w`*) <= 1020, onde `M` é o comprimento do literal do elemento e *`w`* é o número de bytes necessários para o caractere de comprimento máximo no conjunto de caracteres.
* `SET('value1','value2',...) [CHARACTER SET charset_name]`

  Um conjunto. Um objeto de string que pode ter zero ou mais valores, cada um dos quais deve ser escolhido da lista de valores `'value1'`, `'value2'`, `...` Os valores `SET` são representados internamente como inteiros.

  Uma coluna `SET` pode ter um máximo de 64 membros distintos.

  O comprimento máximo suportado de um elemento `SET` individual é *`M`* <= 255 e (*`M`* x *`w`*) <= 1020, onde `M` é o comprimento do literal do elemento e *`w`* é o número de bytes necessários para o caractere de comprimento máximo no conjunto de caracteres.