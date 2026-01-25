### 13.8.3 Declaração HELP

```sql
HELP 'search_string'
```

A declaração [`HELP`](help.html "13.8.3 HELP Statement") retorna informações online do Manual de Referência do MySQL. Seu funcionamento adequado requer que as tabelas de ajuda no `database` `mysql` sejam inicializadas com informações de tópicos de ajuda (consulte [Section 5.1.14, “Server-Side Help Support”](server-side-help-support.html "5.1.14 Server-Side Help Support")).

A declaração [`HELP`](help.html "13.8.3 HELP Statement") pesquisa as tabelas de ajuda pela `search string` fornecida e exibe o resultado da pesquisa. A `search string` não diferencia maiúsculas de minúsculas (`case-sensitive`).

A `search string` pode conter os caracteres `wildcard` `%` e `_`. Estes têm o mesmo significado que nas operações de correspondência de padrão realizadas com o operador [`LIKE`](string-comparison-functions.html#operator_like). Por exemplo, `HELP 'rep%'` retorna uma lista de tópicos que começam com `rep`.

A declaração `HELP` não requer um terminador, como `;` ou `\G`.

A declaração `HELP` compreende vários tipos de `search strings`:

* No nível mais geral, use `contents` para recuperar uma lista das categorias de ajuda de nível superior:

  ```sql
  HELP 'contents'
  ```

* Para uma lista de tópicos em uma determinada categoria de ajuda, como `Data Types`, use o nome da categoria:

  ```sql
  HELP 'data types'
  ```

* Para ajuda sobre um tópico de ajuda específico, como a `function` [`ASCII()`](string-functions.html#function_ascii) ou a declaração [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), use a `keyword` ou `keywords` associadas:

  ```sql
  HELP 'ascii'
  HELP 'create table'
  ```

Em outras palavras, a `search string` corresponde a uma categoria, a muitos tópicos ou a um único tópico. As descrições a seguir indicam as formas que o `result set` pode assumir.

* Resultado vazio

  Nenhuma correspondência pôde ser encontrada para a `search string`.

  Exemplo: `HELP 'fake'`

  Resulta em:

  ```sql
  Nothing found
  Please try to run 'help contents' for a list of all accessible topics
  ```

* `Result set` contendo uma única linha

  Isso significa que a `search string` encontrou uma correspondência (`hit`) para o tópico de ajuda. O resultado inclui os seguintes itens:

  + `name`: O nome do tópico.
  + `description`: Texto de ajuda descritivo para o tópico.

  + `example`: Um ou mais exemplos de uso. (Pode estar vazio.)

  Exemplo: `HELP 'log'`

  Resulta em:

  ```sql
  Name: 'LOG'
  Description:
  Syntax:
  LOG(X), LOG(B,X)

  If called with one parameter, this function returns the natural
  logarithm of X. If X is less than or equal to 0.0E0, the function
  returns NULL and a warning "Invalid argument for logarithm" is
  reported. Returns NULL if X or B is NULL.

  The inverse of this function (when called with a single argument) is
  the EXP() function.

  URL: https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html

  Examples:
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

* Lista de tópicos.

  Isso significa que a `search string` correspondeu a múltiplos tópicos de ajuda.

  Exemplo: `HELP 'status'`

  Resulta em:

  ```sql
  Many help items for your request exist.
  To make a more specific request, please type 'help <item>',
  where <item> is one of the following topics:
     FLUSH
     SHOW
     SHOW ENGINE
     SHOW FUNCTION STATUS
     SHOW MASTER STATUS
     SHOW PROCEDURE STATUS
     SHOW SLAVE STATUS
     SHOW STATUS
     SHOW TABLE STATUS
  ```

* Lista de tópicos.

  Uma lista também é exibida se a `search string` corresponder a uma categoria.

  Exemplo: `HELP 'functions'`

  Resulta em:

  ```sql
  You asked for help about help category: "Functions"
  For more information, type 'help <item>', where <item> is one of the following
  categories:
     Aggregate Functions and Modifiers
     Bit Functions
     Cast Functions and Operators
     Comparison Operators
     Date and Time Functions
     Encryption Functions
     Enterprise Encryption Functions
     Flow Control Functions
     GROUP BY Functions and Modifiers
     GTID
     Information Functions
     Locking Functions
     Logical Operators
     Miscellaneous Functions
     Numeric Functions
     Spatial Functions
     String Functions
     XML
  ```