### 11.3.1 Sintaxe dos Tipos de Dados String

Os tipos de dados string são `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `BLOB`, `TEXT`, `ENUM`, e `SET`.

Em alguns casos, o MySQL pode alterar uma coluna string para um tipo diferente daquele fornecido em uma instrução `CREATE TABLE` ou `ALTER TABLE`. Consulte a Seção 13.1.18.6, “Silent Column Specification Changes” (Alterações Silenciosas na Especificação de Colunas).

Para definições de colunas de string de caracteres (`CHAR`, `VARCHAR` e os tipos `TEXT`), o MySQL interpreta as especificações de comprimento em unidades de caractere. Para definições de colunas de string binárias (`BINARY`, `VARBINARY` e os tipos `BLOB`), o MySQL interpreta as especificações de comprimento em unidades de byte.

As definições de coluna para tipos de dados de string de caractere (`CHAR`, `VARCHAR`, os tipos `TEXT`, `ENUM`, `SET` e quaisquer sinônimos) podem especificar o character set e a collation da coluna:

* `CHARACTER SET` especifica o character set. Se desejado, uma collation para o character set pode ser especificada com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Por exemplo:

  ```sql
  CREATE TABLE t
  (
      c1 VARCHAR(20) CHARACTER SET utf8,
      c2 TEXT CHARACTER SET latin1 COLLATE latin1_general_cs
  );
  ```

  Esta definição de tabela cria uma coluna chamada `c1` que possui um character set `utf8` com a collation padrão para aquele character set, e uma coluna chamada `c2` que possui um character set `latin1` e uma collation case-sensitive (`_cs`).

  As regras para atribuir o character set e a collation quando um ou ambos, `CHARACTER SET` e o atributo `COLLATE`, estão ausentes, são descritas na Seção 10.3.5, “Column Character Set and Collation” (Character Set e Collation da Coluna).

  `CHARSET` é um sinônimo para `CHARACTER SET`.

* Especificar o atributo `CHARACTER SET binary` para um tipo de dados string de caractere faz com que a coluna seja criada como o tipo de dados string binária correspondente: `CHAR` se torna `BINARY`, `VARCHAR` se torna `VARBINARY`, e `TEXT` se torna `BLOB`. Para os tipos de dados `ENUM` e `SET`, isso não ocorre; eles são criados conforme declarados. Suponha que você especifique uma tabela usando esta definição:

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

* O atributo `BINARY` é uma extensão não padrão do MySQL que é um atalho para especificar a collation binária (`_bin`) do character set da coluna (ou do character set padrão da tabela se nenhum character set da coluna for especificado). Neste caso, a comparação e a ordenação são baseadas em valores numéricos do código do caractere. Suponha que você especifique uma tabela usando esta definição:

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

* O atributo `ASCII` é um atalho para `CHARACTER SET latin1`.

* O atributo `UNICODE` é um atalho para `CHARACTER SET ucs2`.

A comparação e a ordenação de colunas de caractere são baseadas na collation atribuída à coluna. Para os tipos de dados `CHAR`, `VARCHAR`, `TEXT`, `ENUM` e `SET`, você pode declarar uma coluna com uma collation binária (`_bin`) ou o atributo `BINARY` para fazer com que a comparação e a ordenação usem os valores de código de caractere subjacentes em vez de uma ordenação lexical.

Para informações adicionais sobre o uso de character sets no MySQL, consulte o Capítulo 10, *Character Sets, Collations, Unicode*.

* `[NATIONAL] CHAR[(M)] [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma string de comprimento fixo que é sempre preenchida à direita com espaços até o comprimento especificado quando armazenada. *`M`* representa o comprimento da coluna em caracteres. O intervalo de *`M`* é de 0 a 255. Se *`M`* for omitido, o comprimento é 1.

  Nota

  Espaços finais são removidos quando valores `CHAR` são recuperados, a menos que o modo SQL `PAD_CHAR_TO_FULL_LENGTH` esteja habilitado.

  `CHAR` é um atalho para `CHARACTER`. `NATIONAL CHAR` (ou sua forma abreviada equivalente, `NCHAR`) é a maneira padrão SQL de definir que uma coluna `CHAR` deve usar algum character set predefinido. O MySQL usa `utf8` como esse character set predefinido. Seção 10.3.7, “The National Character Set”.

  O tipo de dados `CHAR BYTE` é um alias para o tipo de dados `BINARY`. Este é um recurso de compatibilidade.

  O MySQL permite criar uma coluna do tipo `CHAR(0)`. Isso é útil principalmente quando você precisa ser compatível com aplicações antigas que dependem da existência de uma coluna, mas que na verdade não usam seu valor. `CHAR(0)` também é interessante quando você precisa de uma coluna que pode aceitar apenas dois valores: Uma coluna que é definida como `CHAR(0) NULL` ocupa apenas um bit e pode aceitar apenas os valores `NULL` e `''` (a string vazia).

* `[NATIONAL] VARCHAR(M) [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma string de comprimento variável. *`M`* representa o comprimento máximo da coluna em caracteres. O intervalo de *`M`* é de 0 a 65.535. O comprimento máximo efetivo de um `VARCHAR` está sujeito ao tamanho máximo da linha (65.535 bytes, que é compartilhado entre todas as colunas) e ao character set utilizado. Por exemplo, caracteres `utf8` podem exigir até três bytes por caractere, então uma coluna `VARCHAR` que usa o character set `utf8` pode ser declarada com um máximo de 21.844 caracteres. Consulte a Seção 8.4.7, “Limits on Table Column Count and Row Size” (Limites de Contagem de Colunas e Tamanho de Linha da Tabela).

  O MySQL armazena valores `VARCHAR` como um prefixo de comprimento de 1 byte ou 2 bytes mais os dados. O prefixo de comprimento indica o número de bytes no valor. Uma coluna `VARCHAR` usa um byte de comprimento se os valores exigirem no máximo 255 bytes, e dois bytes de comprimento se os valores puderem exigir mais de 255 bytes.

  Nota

  O MySQL segue a especificação SQL padrão e *não* remove espaços finais dos valores `VARCHAR`.

  `VARCHAR` é um atalho para `CHARACTER VARYING`. `NATIONAL VARCHAR` é a maneira padrão SQL de definir que uma coluna `VARCHAR` deve usar algum character set predefinido. O MySQL usa `utf8` como esse character set predefinido. Seção 10.3.7, “The National Character Set”. `NVARCHAR` é um atalho para `NATIONAL VARCHAR`.

* `BINARY[(M)]`

  O tipo `BINARY` é semelhante ao tipo `CHAR`, mas armazena strings de bytes binárias em vez de strings de caracteres não binárias. Um comprimento opcional *`M`* representa o comprimento da coluna em bytes. Se omitido, *`M`* assume o padrão 1.

* `VARBINARY(M)`

  O tipo `VARBINARY` é semelhante ao tipo `VARCHAR`, mas armazena strings de bytes binárias em vez de strings de caracteres não binárias. *`M`* representa o comprimento máximo da coluna em bytes.

* `TINYBLOB`

  Uma coluna `BLOB` com um comprimento máximo de 255 (2⁸ − 1) bytes. Cada valor `TINYBLOB` é armazenado usando um prefixo de comprimento de 1 byte que indica o número de bytes no valor.

* `TINYTEXT [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 255 (2⁸ − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `TINYTEXT` é armazenado usando um prefixo de comprimento de 1 byte que indica o número de bytes no valor.

* `BLOB[(M)]`

  Uma coluna `BLOB` com um comprimento máximo de 65.535 (2¹⁶ − 1) bytes. Cada valor `BLOB` é armazenado usando um prefixo de comprimento de 2 bytes que indica o número de bytes no valor.

  Um comprimento opcional *`M`* pode ser fornecido para este tipo. Se isso for feito, o MySQL cria a coluna como o menor tipo `BLOB` grande o suficiente para armazenar valores de *`M`* bytes de comprimento.

* `TEXT[(M)] [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 65.535 (2¹⁶ − 1) bytes. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `TEXT` é armazenado usando um prefixo de comprimento de 2 bytes que indica o número de bytes no valor.

  Um comprimento opcional *`M`* pode ser fornecido para este tipo. Se isso for feito, o MySQL cria a coluna como o menor tipo `TEXT` grande o suficiente para armazenar valores de *`M`* caracteres de comprimento.

* `MEDIUMBLOB`

  Uma coluna `BLOB` com um comprimento máximo de 16.777.215 (2²⁴ − 1) bytes. Cada valor `MEDIUMBLOB` é armazenado usando um prefixo de comprimento de 3 bytes que indica o número de bytes no valor.

* `MEDIUMTEXT [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 16.777.215 (2²⁴ − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. Cada valor `MEDIUMTEXT` é armazenado usando um prefixo de comprimento de 3 bytes que indica o número de bytes no valor.

* `LONGBLOB`

  Uma coluna `BLOB` com um comprimento máximo de 4.294.967.295 ou 4GB (2³² − 1) bytes. O comprimento máximo efetivo das colunas `LONGBLOB` depende do tamanho máximo de pacote configurado no protocolo cliente/servidor e da memória disponível. Cada valor `LONGBLOB` é armazenado usando um prefixo de comprimento de 4 bytes que indica o número de bytes no valor.

* `LONGTEXT [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma coluna `TEXT` com um comprimento máximo de 4.294.967.295 ou 4GB (2³² − 1) caracteres. O comprimento máximo efetivo é menor se o valor contiver caracteres multibyte. O comprimento máximo efetivo das colunas `LONGTEXT` também depende do tamanho máximo de pacote configurado no protocolo cliente/servidor e da memória disponível. Cada valor `LONGTEXT` é armazenado usando um prefixo de comprimento de 4 bytes que indica o número de bytes no valor.

* `ENUM('value1','value2',...) [CHARACTER SET charset_name] [COLLATE collation_name]`

  Uma enumeração. Um objeto string que pode ter apenas um valor, escolhido na lista de valores `'value1'`, `'value2'`, `...`, `NULL` ou o valor de erro especial `''`. Valores `ENUM` são representados internamente como inteiros.

  Uma coluna `ENUM` pode ter um máximo de 65.535 elementos distintos. (O limite prático é inferior a 3000.) Uma tabela pode ter no máximo 255 definições de lista de elementos únicas entre suas colunas `ENUM` e `SET` consideradas como um grupo. Para mais informações sobre esses limites, consulte Limits Imposed by .frm File Structure (Limites Impostos pela Estrutura do Arquivo .frm).

* `SET('value1','value2',...) [CHARACTER SET charset_name] [COLLATE collation_name]`

  Um set (conjunto). Um objeto string que pode ter zero ou mais valores, cada um dos quais deve ser escolhido na lista de valores `'value1'`, `'value2'`, `...` Valores `SET` são representados internamente como inteiros.

  Uma coluna `SET` pode ter um máximo de 64 membros distintos. Uma tabela pode ter no máximo 255 definições de lista de elementos únicas entre suas colunas `ENUM` e `SET` consideradas como um grupo. Para mais informações sobre este limite, consulte Limits Imposed by .frm File Structure.