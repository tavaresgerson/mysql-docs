### 9.2.2 Qualificadores de Identificadores

Nomes de objetos podem ser não qualificados (*unqualified*) ou qualificados (*qualified*). Um nome não qualificado é permitido em contextos onde a interpretação do nome é inequívoca. Um nome qualificado inclui pelo menos um *qualifier* para clarificar o contexto de interpretação, substituindo um contexto padrão (*default*) ou fornecendo um contexto ausente.

Por exemplo, esta instrução cria uma table usando o nome não qualificado `t1`:

```sql
CREATE TABLE t1 (i INT);
```

Como `t1` não inclui nenhum *qualifier* para especificar um Database, a instrução cria a table no *default Database*. Se não houver um *default Database*, ocorre um erro.

Esta instrução cria uma table usando o nome qualificado `db1.t1`:

```sql
CREATE TABLE db1.t1 (i INT);
```

Como `db1.t1` inclui o *qualifier* de Database `db1`, a instrução cria `t1` no Database chamado `db1`, independentemente do *default Database*. O *qualifier* *deve* ser especificado se não houver um *default Database*. O *qualifier* *pode* ser especificado se houver um *default Database*, para especificar um Database diferente do padrão, ou para tornar o Database explícito se o padrão for o mesmo que o especificado.

Qualifiers possuem as seguintes características:

* Um nome não qualificado consiste em um único *identifier*. Um nome qualificado consiste em múltiplos *identifiers*.

* Os componentes de um nome com múltiplas partes devem ser separados por caracteres de ponto (`.`). As partes iniciais de um nome com múltiplas partes atuam como *qualifiers* que afetam o contexto no qual o *identifier* final deve ser interpretado.

* O caractere *qualifier* é um *token* separado e não precisa ser contíguo aos *identifiers* associados. Por exemplo, *`tbl_name.col_name`* e *`tbl_name . col_name`* são equivalentes.

* Se qualquer componente de um nome com múltiplas partes exigir aspas (*quoting*), coloque aspas individualmente em vez de colocar aspas no nome como um todo. Por exemplo, escreva `` `my-table`.`my-column` ``, não `` `my-table.my-column` ``.

* Uma palavra reservada que segue um ponto em um nome qualificado deve ser um *identifier*, portanto, nesse contexto, ela não precisa de aspas.

* A sintaxe `.tbl_name` significa a table *`tbl_name`* no *default Database*.

  Note

  Esta sintaxe está obsoleta (*deprecated*) desde o MySQL 5.7.20; espere que ela seja removida em uma versão futura do MySQL.

Os *qualifiers* permitidos para nomes de objetos dependem do tipo de objeto:

* Um nome de Database é totalmente qualificado e não requer *qualifier*:

```sql
  CREATE DATABASE db1;
  ```

* Um nome de table, *view* ou programa armazenado pode receber um *qualifier* de nome de Database. Exemplos de nomes não qualificados e qualificados em instruções `CREATE`:

```sql
  CREATE TABLE mytable ...;
  CREATE VIEW myview ...;
  CREATE PROCEDURE myproc ...;
  CREATE FUNCTION myfunc ...;
  CREATE EVENT myevent ...;

  CREATE TABLE mydb.mytable ...;
  CREATE VIEW mydb.myview ...;
  CREATE PROCEDURE mydb.myproc ...;
  CREATE FUNCTION mydb.myfunc ...;
  CREATE EVENT mydb.myevent ...;
  ```

* Um *trigger* está associado a uma table, então qualquer *qualifier* se aplica ao nome da table:

```sql
  CREATE TRIGGER mytrigger ... ON mytable ...;

  CREATE TRIGGER mytrigger ... ON mydb.mytable ...;
  ```

* Um nome de column pode receber múltiplos *qualifiers* para indicar o contexto em instruções que o referenciam, conforme mostrado na tabela a seguir.

<table summary="Formatos de referência de column que podem ser usados para referenciar columns de table."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Referência de Column</th> <th>Significado</th> </tr></thead><tbody><tr> <td><em><code>col_name</code></em></td> <td>A Column <em><code>col_name</code></em> de qualquer table usada na instrução que contenha uma Column com esse nome</td> </tr><tr> <td><em><code>tbl_name.col_name</code></em></td> <td>A Column <em><code>col_name</code></em> da table <em><code>tbl_name</code></em> do default Database</td> </tr><tr> <td><em><code>db_name.tbl_name.col_name</code></em></td> <td>A Column <em><code>col_name</code></em> da table <em><code>tbl_name</code></em> do Database <em><code>db_name</code></em></td> </tr></tbody></table>

Em outras palavras, um nome de column pode receber um *qualifier* de nome de table, que por sua vez pode receber um *qualifier* de nome de Database. Exemplos de referências de column não qualificadas e qualificadas em instruções `SELECT`:

```sql
  SELECT c1 FROM mytable
  WHERE c2 > 100;

  SELECT mytable.c1 FROM mytable
  WHERE mytable.c2 > 100;

  SELECT mydb.mytable.c1 FROM mydb.mytable
  WHERE mydb.mytable.c2 > 100;
  ```

Você não precisa especificar um *qualifier* para uma referência de objeto em uma instrução, a menos que a referência não qualificada seja ambígua. Suponha que a column `c1` ocorra apenas na table `t1`, `c2` apenas na `t2`, e `c` em ambas `t1` e `t2`. Qualquer referência não qualificada a `c` é ambígua em uma instrução que se refere a ambas as tables e deve ser qualificada como `t1.c` ou `t2.c` para indicar qual table você quer dizer:

```sql
SELECT c1, c2, t1.c FROM t1 INNER JOIN t2
WHERE t2.c > 100;
```

De forma semelhante, para recuperar dados de uma table `t` no Database `db1` e de uma table `t` no Database `db2` na mesma instrução, você deve qualificar as referências de table. Para referências a columns nessas tables, *qualifiers* são exigidos apenas para nomes de column que aparecem em ambas as tables. Suponha que a column `c1` ocorra apenas na table `db1.t`, `c2` apenas na `db2.t`, e `c` em ambas `db1.t` e `db2.t`. Neste caso, `c` é ambíguo e deve ser qualificado, mas `c1` e `c2` não precisam ser:

```sql
SELECT c1, c2, db1.t.c FROM db1.t INNER JOIN db2.t
WHERE db2.t.c > 100;
```

*Aliases* de table permitem que referências qualificadas de column sejam escritas de forma mais simples:

```sql
SELECT c1, c2, t1.c FROM db1.t AS t1 INNER JOIN db2.t AS t2
WHERE t2.c > 100;
```