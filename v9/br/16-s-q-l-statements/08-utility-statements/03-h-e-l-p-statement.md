### 15.8.3 Declaração `HELP`

```
HELP 'search_string'
```

A declaração `HELP` retorna informações online do Manual de Referência do MySQL. Seu funcionamento adequado requer que as tabelas de ajuda no banco de dados `mysql` sejam inicializadas com informações de tópicos de ajuda (veja a Seção 7.1.17, “Suporte de Ajuda no Lado do Servidor”).

A declaração `HELP` busca as tabelas de ajuda pelo string de busca fornecido e exibe o resultado da busca. O string de busca não é case-sensitive.

O string de busca pode conter os caracteres curinga `%` e `_`. Esses têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, `HELP 'rep%'` retorna uma lista de tópicos que começam com `rep`.

A declaração `HELP` não requer um delimitador como `;` ou `\G`.

A declaração `HELP` entende vários tipos de strings de busca:

* No nível mais geral, use `contents` para recuperar uma lista das categorias de ajuda de nível superior:

  ```
  HELP 'contents'
  ```

* Para uma lista de tópicos em uma categoria de ajuda dada, como `Data Types`, use o nome da categoria:

  ```
  HELP 'data types'
  ```

* Para obter ajuda sobre um tópico de ajuda específico, como a função `ASCII()` ou a instrução `CREATE TABLE`, use a(s) palavra(s) chave(s) associada(s):

  ```
  HELP 'ascii'
  HELP 'create table'
  ```

Em outras palavras, o string de busca corresponde a uma categoria, muitos tópicos ou um único tópico. As descrições a seguir indicam as formas que o conjunto de resultados pode assumir.

* Resultado vazio

  Nenhum resultado foi encontrado para o string de busca.

  Exemplo: `HELP 'fake'`

  Retorna:

  ```
  Nothing found
  Please try to run 'help contents' for a list of all accessible topics
  ```

* Conjunto de resultados contendo uma única linha

  Isso significa que o string de busca produziu um resultado para o tópico de ajuda. O resultado inclui os seguintes itens:

  + `name`: O nome do tópico.
  + `description`: Texto de ajuda descritivo para o tópico.

+ `exemplo`: Um ou mais exemplos de uso. (Pode estar vazio.)

  Exemplo: `AJUDA 'log'`

  Retorna:

  ```
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

  URL: https://dev.mysql.com/doc/refman/8.4/en/mathematical-functions.html

  Examples:
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

* Lista de tópicos.

  Isso significa que a string de busca correspondeu a vários tópicos de ajuda.

  Exemplo: `AJUDA 'status'`

  Retorna:

  ```
  Many help items for your request exist.
  To make a more specific request, please type 'help <item>',
  where <item> is one of the following topics:
     FLUSH
     SHOW
     SHOW BINARY LOG STATUS
     SHOW ENGINE
     SHOW FUNCTION STATUS
     SHOW PROCEDURE STATUS
     SHOW REPLICA STATUS
     SHOW STATUS
     SHOW TABLE STATUS
  ```

* Lista de tópicos.

  Uma lista também é exibida se a string de busca corresponder a uma categoria.

  Exemplo: `AJUDA 'funções'`

  Retorna:

  ```
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
     Internal Functions
     Locking Functions
     Logical Operators
     Miscellaneous Functions
     Numeric Functions
     Performance Schema Functions
     Spatial Functions
     String Functions
     Window Functions
     XML
  ```