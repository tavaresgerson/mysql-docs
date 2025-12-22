#### 7.4.4.4 Formato de registo para alterações em tabelas de banco de dados mysql

O conteúdo das tabelas de concessão no banco de dados `mysql` pode ser modificado diretamente (por exemplo, com `INSERT` ou `DELETE`) ou indiretamente (por exemplo, com `GRANT` ou `CREATE USER`).

- As instruções de manipulação de dados que mudam os dados nas tabelas de banco de dados diretamente são registradas de acordo com a configuração da variável do sistema PH. Isso se refere a instruções como `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `DO`, `LOAD DATA`, `SELECT` e `TRUNCATE TABLE`.
- As instruções que alteram indiretamente o banco de dados `mysql` são registradas como instruções, independentemente do valor de `binlog_format`. Isso diz respeito a instruções como `GRANT`, `REVOKE`, `SET PASSWORD`, `RENAME USER`, `CREATE` (todas as formas exceto `CREATE TABLE ... SELECT`), `ALTER` (todas as formas) e `DROP` (todas as formas).

A parte `CREATE TABLE` é registrada usando o formato de instrução e a parte `SELECT` é registrada de acordo com o valor de `binlog_format`.
