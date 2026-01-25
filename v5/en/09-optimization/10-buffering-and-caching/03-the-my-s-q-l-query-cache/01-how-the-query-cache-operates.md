#### 8.10.3.1 Como o Query Cache Opera

Nota

O query cache está descontinuado desde o MySQL 5.7.20 e foi removido no MySQL 8.0.

Esta seção descreve como o query cache funciona quando está operacional. A Seção 8.10.3.3, “Query Cache Configuration”, descreve como controlar se ele deve estar operacional.

As Queries de entrada são comparadas com as que estão no query cache antes da análise (parsing), de modo que as duas Queries a seguir são consideradas diferentes pelo query cache:

```sql
SELECT * FROM tbl_name
Select * from tbl_name
```

As Queries devem ser *exatamente* iguais (byte por byte) para serem consideradas idênticas. Além disso, strings de Query idênticas podem ser tratadas como diferentes por outros motivos. Queries que usam Databases diferentes, versões de protocolo diferentes ou conjuntos de caracteres (character sets) padrão diferentes são consideradas Queries distintas e são armazenadas em cache separadamente.

O cache não é usado para Queries dos seguintes tipos:

* Queries que são uma subquery de uma Query externa
* Queries executadas dentro do corpo de uma stored function, trigger ou event

Antes que um resultado de Query seja buscado no query cache, o MySQL verifica se o usuário tem o privilégio `SELECT` para todos os Databases e Tables envolvidos. Se este não for o caso, o resultado em cache não é usado.

Se um resultado de Query for retornado do query cache, o servidor incrementa a variável de status `Qcache_hits`, e não a `Com_select`. Consulte a Seção 8.10.3.4, “Query Cache Status and Maintenance”.

Se uma Table mudar, todas as Queries em cache que usam essa Table tornam-se inválidas e são removidas do cache. Isso inclui Queries que usam Tables `MERGE` mapeadas para a Table alterada. Uma Table pode ser alterada por muitos tipos de statements, como `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE TABLE`, `ALTER TABLE`, `DROP TABLE` ou `DROP DATABASE`.

O query cache também funciona dentro de transactions ao usar Tables `InnoDB`.

O resultado de uma Query `SELECT` em uma view é armazenado em cache.

O query cache funciona para Queries `SELECT SQL_CALC_FOUND_ROWS ...` e armazena um valor que é retornado por uma Query `SELECT FOUND_ROWS()` subsequente. `FOUND_ROWS()` retorna o valor correto mesmo se a Query anterior foi buscada do cache, pois o número de linhas encontradas também é armazenado no cache. A Query `SELECT FOUND_ROWS()` em si não pode ser armazenada em cache.

Prepared statements (declarações preparadas) que são emitidas usando o protocolo binário, utilizando `mysql_stmt_prepare()` e `mysql_stmt_execute()` (consulte C API Prepared Statement Interface), estão sujeitas a limitações no caching. A comparação com statements no query cache é baseada no texto do statement após a expansão dos marcadores de parâmetro (`?` parameter markers). O statement é comparado apenas com outros statements em cache que foram executados usando o protocolo binário. Ou seja, para fins de query cache, prepared statements emitidos usando o protocolo binário são distintos de prepared statements emitidos usando o protocolo de texto (consulte a Seção 13.5, “Prepared Statements”).

Uma Query não pode ser armazenada em cache se usar qualquer uma das seguintes funções:

* `AES_DECRYPT()`
* `AES_ENCRYPT()`
* `BENCHMARK()`
* `CONNECTION_ID()`
* `CONVERT_TZ()`
* `CURDATE()`
* `CURRENT_DATE()`
* `CURRENT_TIME()`
* `CURRENT_TIMESTAMP()`
* `CURRENT_USER()`
* `CURTIME()`
* `DATABASE()`
* `ENCRYPT()` com um parâmetro

* `FOUND_ROWS()`
* `GET_LOCK()`
* `IS_FREE_LOCK()`
* `IS_USED_LOCK()`
* `LAST_INSERT_ID()`
* `LOAD_FILE()`
* `MASTER_POS_WAIT()`
* `NOW()`
* `PASSWORD()`
* `RAND()`
* `RANDOM_BYTES()`
* `RELEASE_ALL_LOCKS()`
* `RELEASE_LOCK()`
* `SLEEP()`
* `SYSDATE()`
* `UNIX_TIMESTAMP()` sem parâmetros

* `USER()`
* `UUID()`
* `UUID_SHORT()`

Uma Query também não é armazenada em cache sob estas condições:

* Ela se refere a funções carregáveis (loadable functions) ou stored functions.
* Ela se refere a variáveis de usuário (user variables) ou variáveis locais de programa armazenado.

* Ela se refere a Tables nos Databases `mysql`, `INFORMATION_SCHEMA` ou `performance_schema`.

* Ela se refere a quaisquer Tables particionadas.
* Está em qualquer uma das seguintes formas:

  ```sql
  SELECT ... LOCK IN SHARE MODE
  SELECT ... FOR UPDATE
  SELECT ... INTO OUTFILE ...
  SELECT ... INTO DUMPFILE ...
  SELECT * FROM ... WHERE autoincrement_col IS NULL
  ```

  A última forma não é armazenada em cache porque é usada como solução alternativa (workaround) do ODBC para obter o valor do last insert ID. Consulte a seção Connector/ODBC do Capítulo 27, *Connectors and APIs*.

  Statements dentro de transactions que usam o nível de isolamento `SERIALIZABLE` também não podem ser armazenados em cache porque utilizam locking `LOCK IN SHARE MODE`.

* Ela usa `TEMPORARY` tables.
* Ela não usa nenhuma Table.
* Ela gera avisos (warnings).
* O usuário tem um privilégio de nível de coluna para qualquer uma das Tables envolvidas.