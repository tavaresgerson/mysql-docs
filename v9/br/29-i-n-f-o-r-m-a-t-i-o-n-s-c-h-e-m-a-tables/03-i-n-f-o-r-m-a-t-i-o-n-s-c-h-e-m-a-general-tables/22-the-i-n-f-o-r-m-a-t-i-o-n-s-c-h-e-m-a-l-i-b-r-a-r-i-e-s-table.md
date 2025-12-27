### 28.3.22 A Tabela `LIBRARIES` da BASE DE DADOS `INFORMATION_SCHEMA`

A tabela `LIBRARIES` contém informações sobre as bibliotecas JavaScript e WebAssembly conhecidas pelo componente JavaScript do MLE (ver Seção 7.5.7, “Componente do Motor Multilíngue (MLE”)”).

A tabela `LIBRARIES` tem as seguintes colunas:

* `LIBRARY_CATALOG`

  Nome do catálogo da biblioteca. Atualmente, isso é sempre `def`.

* `LIBRARY_SCHEMA`

  Esquema (banco de dados) ao qual a biblioteca pertence.

* `LIBRARY_NAME`

  Nome da biblioteca.

* `LIBRARY_DEFINITION`

  Texto da definição da biblioteca JavaScript. Para bibliotecas WebAssembly, esta coluna está em branco.

* `LANGUAGE`

  Idioma. No MySQL 9.5, isso é `JAVASCRIPT` ou `WASM`.

* `CREATED`

  Data e hora de criação da biblioteca.

* `LAST_ALTERED`

  Data e hora da última alteração na biblioteca.

* `SQL_MODE`

  Modo SQL em vigor no momento da criação (ver Seção 7.1.11, “Modos SQL do Servidor”). Este é um conjunto que pode incluir nenhum ou um ou mais dos seguintes: `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `ONLY_FULL_GROUP_BY`, `NO_UNSIGNED_SUBTRACTION`, `NO_DIR_IN_CREATE`, `ANSI`, `NO_AUTO_VALUE_ON_ZERO`, `NO_BACKSLASH_ESCAPES`, `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ALLOW_INVALID_DATES`, `ERROR_FOR_DIVISION_BY_ZERO`, `TRADITIONAL`, `HIGH_NOT_PRECEDENCE`, `NO_ENGINE_SUBSTITUTION`, `PAD_CHAR_TO_FULL_LENGTH`, `TIME_TRUNCATE_FRACTIONAL`. O padrão é `ONLY_FULL_GROUP_BY, STRICT_TRANS_TABLES, NO_ZERO_IN_DATE, NO_ZERO_DATE, ERROR_FOR_DIVISION_BY_ZERO, NO_ENGINE_SUBSTITUTION`.

* `LIBRARY_COMMENT`

  Comentário especificado, se houver, quando a biblioteca foi criada (ou alterada pela última vez, usando `ALTER LIBRARY`).

* `CREATOR`

  Conta de usuário que criou a biblioteca.

Exemplo:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib1 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib2 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function g(n) {
    $>         return n * 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM information_schema.LIBRARIES
    -> WHERE LIBRARY_SCHEMA='jslib'\G
*************************** 1. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib1
LIBRARY_DEFINITION:
      export function f(n) {
        return n
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
*************************** 2. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib2
LIBRARY_DEFINITION:
      export function g(n) {
        return n * 2
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
2 rows in set (0.00 sec)
```