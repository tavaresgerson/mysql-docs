### 15.8.3 Declaração de AJUDA

```
HELP 'search_string'
```

A declaração `HELP` retorna informações online do Manual de Referência do MySQL. Seu funcionamento adequado requer que as tabelas de ajuda no banco de dados `mysql` sejam inicializadas com informações sobre tópicos de ajuda (veja a Seção 7.1.17, “Suporte de Ajuda no Lado do Servidor”).

A declaração `HELP` pesquisa as tabelas de ajuda pelo string de busca fornecido e exibe o resultado da pesquisa. O string de busca não é case-sensitive.

A string de busca pode conter os caracteres de ponto de interrogação `%` e `_`. Estes têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, `HELP 'rep%'` retorna uma lista de tópicos que começam com `rep`.

A declaração `HELP` não requer um finalizador, como `;` ou `\G`.

A declaração `HELP` entende vários tipos de strings de pesquisa:

- No nível mais geral, use `contents` para obter uma lista das categorias de ajuda de nível superior:

  ```
  HELP 'contents'
  ```

- Para obter uma lista de tópicos em uma categoria de ajuda específica, como `Data Types`, use o nome da categoria:

  ```
  HELP 'data types'
  ```

- Para obter ajuda sobre um tópico específico, como a função `ASCII()` ou a instrução `CREATE TABLE`, use a(s) palavra(s)-chave(s) associada(s):

  ```
  HELP 'ascii'
  HELP 'create table'
  ```

Em outras palavras, a string de busca corresponde a uma categoria, muitos tópicos ou um único tópico. As descrições a seguir indicam as formas que o conjunto de resultados pode assumir.

- Resultado vazio

  Não foi encontrado nenhum jogo para a string de busca.

  Exemplo: `HELP 'fake'`

  Rendimentos:

  ```
  Nothing found
  Please try to run 'help contents' for a list of all accessible topics
  ```

- Conjunto de resultados contendo uma única linha

  Isso significa que a string de busca retornou um resultado para o tópico de ajuda. O resultado inclui os seguintes itens:

  - `name`: O nome do tópico.

  - `description`: Texto de ajuda descritiva para o tópico.

  - `example`: Um ou mais exemplos de uso. (Pode estar vazio.)

  Exemplo: `HELP 'log'`

  Rendimentos:

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

  URL: https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html

  Examples:
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

- Lista de tópicos.

  Isso significa que a string de busca correspondeu a vários tópicos de ajuda.

  Exemplo: `HELP 'status'`

  Rendimentos:

  ```
  Many help items for your request exist.
  To make a more specific request, please type 'help <item>',
  where <item> is one of the following topics:
     FLUSH
     SHOW
     SHOW ENGINE
     SHOW FUNCTION STATUS
     SHOW MASTER STATUS
     SHOW PROCEDURE STATUS
     SHOW REPLICA STATUS
     SHOW SLAVE STATUS
     SHOW STATUS
     SHOW TABLE STATUS
  ```

- Lista de tópicos.

  Uma lista também é exibida se a string de busca corresponder a uma categoria.

  Exemplo: `HELP 'functions'`

  Rendimentos:

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
