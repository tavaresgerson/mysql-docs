### 11.2.2 Identificadores Qualificadores

Os nomes de objetos podem ser não qualificados ou qualificados. Um nome não qualificado é permitido em contextos onde a interpretação do nome é inequívoca. Um nome qualificado inclui pelo menos um qualificador para esclarecer o contexto interpretativo, sobrepondo um contexto padrão ou fornecendo o contexto ausente.

Por exemplo, esta declaração cria uma tabela usando o nome não qualificado `t1`:

```
CREATE TABLE t1 (i INT);
```

Como `t1` não inclui nenhum qualificador para especificar um banco de dados, a declaração cria a tabela no banco de dados padrão. Se não houver banco de dados padrão, ocorre um erro.

Esta declaração cria uma tabela usando o nome qualificado `db1.t1`:

```
CREATE TABLE db1.t1 (i INT);
```

Como `db1.t1` inclui um qualificador de banco de dados `db1`, a declaração cria `t1` no banco de dados denominado `db1`, independentemente do banco de dados padrão. O qualificador *deve* ser especificado se não houver banco de dados padrão. O qualificador *pode* ser especificado se houver um banco de dados padrão, para especificar um banco de dados diferente do padrão, ou para tornar o banco de dados explícito se o padrão for o mesmo especificado.

Os qualificadores têm essas características:

* Um nome não qualificado consiste em um único identificador. Um nome qualificado consiste em múltiplos identificadores.
* Os componentes de um nome de múltiplos partes devem ser separados por caracteres de ponto (`.`) . As partes iniciais de um nome de múltiplos partes atuam como qualificadores que afetam o contexto dentro do qual interpretar o identificador final.
* O caractere qualificador é um token separado e não precisa ser contínuo com os identificadores associados. Por exemplo, *`tbl_name.col_name`* e *`tbl_name . col_name`* são equivalentes.
* Se algum componente de um nome de múltiplos partes exigir citação, cite-os individualmente em vez de citar o nome como um todo. Por exemplo, escreva `` `my-table`.`my-column` ``, não `` `my-table.my-column` ``.
* Uma palavra reservada que segue um ponto em um nome qualificado deve ser um identificador, então, nesse contexto, não precisa ser citada.

Os qualificadores permitidos para os nomes de objetos dependem do tipo do objeto:

* O nome de um banco de dados é totalmente qualificado e não aceita nenhum qualificador:

  ```
  CREATE DATABASE db1;
  ```
* O nome de uma tabela, visualização ou programa armazenado pode ser acompanhado de um qualificador de nome de banco de dados. Exemplos de nomes não qualificados e qualificados em declarações `CREATE`:

  ```
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
* Um gatilho está associado a uma tabela, então qualquer qualificador se aplica ao nome da tabela:

  ```
  CREATE TRIGGER mytrigger ... ON mytable ...;

  CREATE TRIGGER mytrigger ... ON mydb.mytable ...;
  ```
* O nome de uma coluna pode ser acompanhado de vários qualificadores para indicar o contexto em declarações que a referenciam, conforme mostrado na tabela a seguir.

  <table><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Referência da Coluna</th> <th>Significado</th> </tr></thead><tbody><tr> <td><em><code>col_name</code></em></td> <td>Coluna <em><code>col_name</code></em> da tabela usada na declaração que contém uma coluna com esse nome</td> </tr><tr> <td><em><code>tbl_name.col_name</code></em></td> <td>Coluna <em><code>col_name</code></em> da tabela <em><code>tbl_name</code></em> do banco de dados padrão</td> </tr><tr> <td><em><code>db_name.tbl_name.col_name</code></em></td> <td>Coluna <em><code>col_name</code></em> da tabela <em><code>tbl_name</code></em> do banco de dados <em><code>db_name</code></em></td> </tr></tbody></table>

  Em outras palavras, o nome de uma coluna pode ser acompanhado de um qualificador de nome de tabela, que por sua vez pode ser acompanhado de um qualificador de nome de banco de dados. Exemplos de referências de coluna não qualificadas e qualificadas em declarações `SELECT`:

  ```
  SELECT c1 FROM mytable
  WHERE c2 > 100;

  SELECT mytable.c1 FROM mytable
  WHERE mytable.c2 > 100;

  SELECT mydb.mytable.c1 FROM mydb.mytable
  WHERE mydb.mytable.c2 > 100;
  ```

Você não precisa especificar um qualificador para uma referência de objeto em uma declaração, a menos que a referência não qualificada seja ambígua. Suponha que a coluna `c1` ocorre apenas na tabela `t1`, `c2` apenas em `t2`, e `c` em ambas `t1` e `t2`. Qualquer referência não qualificada a `c` é ambígua em uma declaração que se refere a ambas as tabelas e deve ser qualificada como `t1.c` ou `t2.c` para indicar qual tabela você quer:

```
SELECT c1, c2, t1.c FROM t1 INNER JOIN t2
WHERE t2.c > 100;
```

Da mesma forma, para recuperar de uma tabela `t` no banco de dados `db1` e de uma tabela `t` no banco de dados `db2` na mesma instrução, você deve qualificar as referências de tabela: para referências a colunas dessas tabelas, os qualificadores são necessários apenas para os nomes de colunas que aparecem em ambas as tabelas. Suponha que a coluna `c1` ocorre apenas na tabela `db1.t`, `c2` apenas em `db2.t` e `c` em ambas `db1.t` e `db2.t`. Neste caso, `c` é ambíguo e deve ser qualificado, mas `c1` e `c2` não precisam:

```
SELECT c1, c2, db1.t.c FROM db1.t INNER JOIN db2.t
WHERE db2.t.c > 100;
```

Os aliases de tabela permitem que as referências de coluna qualificadas sejam escritas de forma mais simples:

```
SELECT c1, c2, t1.c FROM db1.t AS t1 INNER JOIN db2.t AS t2
WHERE t2.c > 100;
```