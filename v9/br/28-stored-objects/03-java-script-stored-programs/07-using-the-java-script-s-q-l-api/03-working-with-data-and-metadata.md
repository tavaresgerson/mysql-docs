#### 27.3.7.3 Trabalhando com Dados e Metadados

##### Conjuntos de Resultados

A função `print_result()`, mostrada aqui, recebe um conjunto de resultados (`SqlResult`) como entrada:

```
function print_result(result) {
  if (result.hasData()) {
    console.log(result.getColumnNames())
    console.log(result.getColumns())

    let row = result.fetchOne()

    while(row) {
      console.log(row.toArray())
      row = result.fetchOne()
    }
  }
  else {
    console.log("Number of affected rows: " + result.getAffectedItemsCount())
    console.log("Last insert ID: " + result.getAutoIncrementValue())
  }

  while(result.nextResult()) {
    console.log("\nNext result set")
    print_result(result)
  }
}
```

Se `query` for o texto de uma instrução SQL válida, a função pode ser chamada da seguinte forma no corpo de um procedimento armazenado JavaScript:

```
let stmt = session.sql(query);
let res = stmt.execute();

print_result(res);
```

`print_result()` imprime sua saída no `stdout`. Isso inclui os nomes das colunas no conjunto de resultados. Se o conjunto de resultados não estiver vazio, o conteúdo de cada linha é impresso na ordem obtida; caso contrário, a função obtém o número de linhas afetadas pela instrução e o valor do ID inserido na última inserção. Finalmente, ela verifica múltiplos conjuntos de resultados usando `nextResult()`, e se houver, chama a si mesma para o próximo conjunto de resultados.

##### Metadados

Esta seção demonstra como obter metadados de colunas.

```
CREATE PROCEDURE jssp_simple_meta(IN query VARCHAR(250))
LANGUAGE JAVASCRIPT AS $$

  let stmt = session.sql(query)
  let result = stmt.execute()

  console.log(result.getColumnNames())

  let cols = result.getColumns()
  let cnt = result.getColumnCount()

  var out = 'COLUMN INFO:'

  for (var i=0; i<cnt; i++) {
    let col = cols[i]

    out += "\nColumn: " + col.getColumnName() + "(" + col.getColumnLabel() + ")"
    out += "; Schema: " + col.getSchemaName()
    out += "; Table: " + col.getTableName() + "(" + col.getTableLabel() + ")"
    out += "; Type: " + col.getType();
  }

  out += "\n"

  console.log(out);

  if (result.hasData()) {
    console.log("ROWS:")
    let row = result.fetchOne()

    while(row) {
      console.log(row.toArray())
      row = result.fetchOne()
    }
  }

$$;
```

Saída:

```
mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.01 sec)

mysql> CALL jssp_simple_meta("
    ">   SELECT c.Name, c.LocalName, t.Name AS Capital, c.Population
    ">   FROM country c
    ">   JOIN countrylanguage l
    ">   ON c.Code=l.CountryCode
    ">   JOIN city t
    ">   ON c.Capital=t.ID
    ">   WHERE l.Language='Swedish'
    "> ");
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state('stdout')\G
*************************** 1. row ***************************
mle_session_state('stdout'): Name,LocalName,Capital,Population
COLUMN INFO:
Column: Name(Name); Schema: world; Table: country(c); Type: STRING
Column: LocalName(LocalName); Schema: world; Table: country(c); Type: STRING
Column: Name(Capital); Schema: world; Table: city(t); Type: STRING
Column: Population(Population); Schema: world; Table: country(c); Type: INT

ROWS:
Denmark,Danmark,København,5330000
Finland,Suomi,Helsinki [Helsingfors],5171300
Norway,Norge,Oslo,4478500
Sweden,Sverige,Stockholm,8861400

1 row in set (0.00 sec)
```

##### Gerenciamento de Erros

Esta seção descreve o gerenciamento básico de erros em programas armazenados JavaScript MySQL, ao usar a API SQL.

Erros SQL encontrados durante a preparação ou execução da instrução são lançados em JavaScript como exceções, onde podem ser tratados usando um ou mais blocos `try ... catch`, caso em que a execução prossegue. Se o erro não for tratado dessa maneira, a execução do procedimento armazenado pára e produz o erro SQL original que foi encontrado durante a execução da consulta SQL dentro do JavaScript.

Executar `SHOW WARNINGS` após a execução de um procedimento armazenado JavaScript retorna os erros ou avisos gerados pela instrução mais recente executada dentro do procedimento.

Alguns erros não podem ser tratados no JavaScript. Por exemplo, se uma consulta é abortada (`CTRL-C`), o programa armazenado para de executar imediatamente e produz um erro. Da mesma forma, erros de falta de memória não podem ser tratados dentro das rotinas do JavaScript.

Uma instrução SQL que causa erros que não são tratados no programa armazenado passa-os de volta ao cliente. Para observar isso, criamos um procedimento armazenado usando a seguinte instrução SQL:

```
CREATE PROCEDURE jssp_simple_error(IN query VARCHAR(250))
LANGUAGE JAVASCRIPT AS $$
 let session = mysql.getSession()
 var result1 = session.sql("SELECT * FROM t_unknown;").execute()
$$;
```

Agora, chamamos `jssp_simple_error()`, passando a ele uma consulta contra uma tabela que sabemos não existir, assim:

```
mysql> CALL jssp_simple_error("SELECT * FROM bogus");
ERROR 1146 (42S02): Table 'test.t_unknown' doesn't exist
```

Você pode optar por tratar erros SQL no JavaScript em vez disso, usando a sintaxe try-catch, assim:

```
CREATE PROCEDURE jssp_catch_errors(IN query VARCHAR(200))
LANGUAGE JAVASCRIPT AS $$
 try {
  var result = session.sql("SELECT * FROM bogus").execute()
 } catch (e) {
  console.error("\nJS Error:\n" + e.name + ":\n" + e.message)
 }
$$;
```

Aqui você pode ver o resultado quando a consulta passada para `jssp_catch_errors()` é uma que tenta acessar uma tabela inexistente:

```
mysql> CALL jssp_catch_errors("SELECT * FROM bogus");
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state('stderr')\G
*************************** 1. row ***************************
mle_session_state('stderr'):
JS Error:
org.graalvm.polyglot.nativeapi.PolyglotNativeAPI$CallbackException:
SQL-CALLOUT: Error code: 1146 Error state: 42S02 Error message: Table 'test.bogus' doesn't exist

1 row in set (0.00 sec)
```