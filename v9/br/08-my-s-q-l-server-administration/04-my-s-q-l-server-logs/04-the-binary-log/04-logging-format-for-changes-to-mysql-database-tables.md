#### 7.4.4.4 Formato de registro para alterações nas tabelas do banco de dados mysql

O conteúdo das tabelas de concessão no banco de dados `mysql` pode ser modificado diretamente (por exemplo, com `INSERT` ou `DELETE`) ou indiretamente (por exemplo, com `GRANT` ou `CREATE USER`). As instruções que afetam as tabelas do banco de dados `mysql` são registradas no log binário usando as seguintes regras:

* As instruções de manipulação de dados que alteram diretamente os dados nas tabelas do banco de dados `mysql` são registradas de acordo com a configuração da variável de sistema `binlog_format`. Isso se aplica a instruções como `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `DO`, `LOAD DATA`, `SELECT` e `TRUNCATE TABLE`.

* As instruções que alteram o `mysql` indiretamente são registradas como instruções, independentemente do valor de `binlog_format`. Isso se aplica a instruções como `GRANT`, `REVOKE`, `SET PASSWORD`, `RENAME USER`, `CREATE` (todas as formas exceto `CREATE TABLE ... SELECT`), `ALTER` (todas as formas) e `DROP` (todas as formas).

`CREATE TABLE ... SELECT` é uma combinação de definição de dados e manipulação de dados. A parte `CREATE TABLE` é registrada usando o formato da instrução e a parte `SELECT` é registrada de acordo com o valor de `binlog_format`.