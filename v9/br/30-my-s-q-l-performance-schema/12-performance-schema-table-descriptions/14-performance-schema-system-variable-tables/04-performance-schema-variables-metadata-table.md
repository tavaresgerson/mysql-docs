#### 29.12.14.4 Variáveis do esquema de desempenho _metadata Tabela

A tabela `variables_metadata` mostra, para cada variável do sistema do servidor, seu nome, escopo, tipo, intervalo de valores (quando aplicável) e descrição.

A tabela `variables_metadata` contém as seguintes colunas:

* `VARIABLE_NAME`

  O nome da variável.

* `VARIABLE_SCOPE`

  O escopo da variável; este é um dos valores listados aqui:

  + `GLOBAL`

    A variável é apenas global.

  + `SESSION`

    A variável pode ter escopo global ou de sessão.

  + SESSION_ONLY

    A variável é apenas de sessão.

* `DATA_TYPE`

  O tipo da variável; este é um dos seguintes valores:

  + `Integer`

    Um inteiro.

  + `Numeric`

    Um valor decimal.

  + `String`

    Uma string.

  + `Enumeration`

    Uma enumeração.

  + `Boolean`

    Um valor `true` ou `false` booleano.

  + `Set`

    Um conjunto de valores.

  Os valores possíveis para variáveis de tipos não numéricos são frequentemente mostrados no texto da coluna `DOCUMENTATION`; caso contrário, consulte a descrição da variável no Manual.

* `MIN_VALUE`

  O valor mínimo permitido para a variável. Para uma variável que não é numérica, este é sempre uma string vazia.

  Esta coluna destina-se a substituir a coluna `MAX_VALUE` da tabela `variables_info`, que foi descontinuada.

* `MAX_VALUE`

  O valor máximo permitido para a variável. Para uma variável que não é numérica, este é sempre uma string vazia.

  Esta coluna destina-se a substituir a coluna `MAX_VALUE` da tabela `variables_info`, que foi descontinuada.

* `DOCUMENTATION`

  Uma descrição da variável; este é o mesmo texto encontrado na saída do **mysqld** `--help` `--verbose`.

A tabela `variables_metadata` não tem índices.

Esta tabela é de leitura somente. As únicas instruções DML permitidas são `SELECT` e `TABLE`; as instruções DDL, incluindo `TRUNCATE TABLE`, não são permitidas.

As três consultas que usam a tabela `variables_metadata` mostradas no exemplo a seguir fornecem informações sobre as variáveis de sistema `binlog_row_image`, `innodb_doublewrite_batch_size` e `secure_file_priv`:

```
mysql> SELECT * FROM variables_metadata WHERE VARIABLE_NAME='binlog_row_image'\G
*************************** 1. row ***************************
 VARIABLE_NAME: binlog_row_image
VARIABLE_SCOPE: SESSION
     DATA_TYPE: Enumeration
     MIN_VALUE:
     MAX_VALUE:
 DOCUMENTATION: Controls whether rows should be logged in 'FULL', 'NOBLOB' or
'MINIMAL' formats. 'FULL', means that all columns in the before and after image
are logged. 'NOBLOB', means that mysqld avoids logging blob columns whenever
possible (e.g. blob column was not changed or is not part of primary key).
'MINIMAL', means that a PK equivalent (PK columns or full row if there is no PK
in the table) is logged in the before image, and only changed columns are logged
in the after image. (Default: FULL).
1 row in set (0.01 sec)

mysql> SELECT * FROM variables_metadata WHERE VARIABLE_NAME='innodb_doublewrite_batch_size'\G
*************************** 1. row ***************************
 VARIABLE_NAME: innodb_doublewrite_batch_size
VARIABLE_SCOPE: GLOBAL
     DATA_TYPE: Integer
     MIN_VALUE: 0
     MAX_VALUE: 256
 DOCUMENTATION: Number of double write pages to write in a batch
1 row in set (0.00 sec)

mysql> SELECT * FROM variables_metadata WHERE VARIABLE_NAME='secure_file_priv'\G
*************************** 1. row ***************************
 VARIABLE_NAME: secure_file_priv
VARIABLE_SCOPE: GLOBAL
     DATA_TYPE: String
     MIN_VALUE:
     MAX_VALUE:
 DOCUMENTATION: Limit LOAD DATA, SELECT ... OUTFILE, and LOAD_FILE() to files within specified directory
1 row in set (0.01 sec)
```

Esta tabela não exibe os valores atuais das variáveis de sistema; essa informação é fornecida pelas tabelas `global_variables` e `session_variables` do Schema de Desempenho.