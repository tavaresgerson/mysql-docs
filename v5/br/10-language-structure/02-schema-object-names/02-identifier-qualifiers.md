### 9.2.2 Identificadores qualificadores

Os nomes de objetos podem ser não qualificados ou qualificados. Um nome não qualificado é permitido em contextos onde a interpretação do nome é inequívoca. Um nome qualificado inclui pelo menos um qualificador para esclarecer o contexto interpretativo, substituindo um contexto padrão ou fornecendo o contexto ausente.

Por exemplo, esta declaração cria uma tabela usando o nome não qualificado `t1`:

```sql
CREATE TABLE t1 (i INT);
```

Como `t1` não inclui um qualificador para especificar um banco de dados, a instrução cria a tabela no banco de dados padrão. Se não houver um banco de dados padrão, ocorrerá um erro.

Essa declaração cria uma tabela usando o nome qualificado `db1.t1`:

```sql
CREATE TABLE db1.t1 (i INT);
```

Como `db1.t1` inclui um qualificador de banco de dados `db1`, a instrução cria `t1` no banco de dados denominado `db1`, independentemente do banco de dados padrão. O qualificador *deve* ser especificado se não houver um banco de dados padrão. O qualificador *pode* ser especificado se houver um banco de dados padrão, para especificar um banco de dados diferente do padrão, ou para tornar o banco de dados explícito se o padrão for o mesmo que o especificado.

Os qualificadores têm essas características:

- Um nome não qualificado consiste em um único identificador. Um nome qualificado consiste em vários identificadores.

- Os componentes de um nome de várias partes devem ser separados por caracteres de ponto (`.`) Os componentes iniciais de um nome de várias partes atuam como qualificadores que afetam o contexto em que o identificador final deve ser interpretado.

- O caractere de qualificador é um token separado e não precisa estar contiguo aos identificadores associados. Por exemplo, *`tbl_name.col_name`* e *`tbl_name . col_name`* são equivalentes.

- Se algum componente de um nome de várias partes exigir aspas, ascuflá-los individualmente, em vez de ascuflar o nome como um todo. Por exemplo, escreva ``minha-tabela`.`minha-coluna``, e não `minha-tabela.minha-coluna`.

- Uma palavra reservada que segue um ponto em um nome qualificado deve ser um identificador, portanto, nesse contexto, ela não precisa ser citada.

- A sintaxe `.tbl_name` significa a tabela *`tbl_name`* no banco de dados padrão.

  Nota

  Essa sintaxe está desatualizada a partir do MySQL 5.7.20; espere-se que ela seja removida em uma versão futura do MySQL.

Os qualificadores permitidos para os nomes de objetos dependem do tipo de objeto:

- O nome de um banco de dados é totalmente qualificado e não aceita qualificadores:

  ```sql
  CREATE DATABASE db1;
  ```

- Um nome de tabela, visualização ou programa armazenado pode receber um qualificador de nome de banco de dados. Exemplos de nomes não qualificados e qualificados em declarações `CREATE`:

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

- Um gatilho está associado a uma tabela, então qualquer qualificador se aplica ao nome da tabela:

  ```sql
  CREATE TRIGGER mytrigger ... ON mytable ...;

  CREATE TRIGGER mytrigger ... ON mydb.mytable ...;
  ```

- Um nome de coluna pode receber vários qualificadores para indicar o contexto em declarações que a referenciam, conforme mostrado na tabela a seguir.

  <table summary="Formatos de referência de colunas que podem ser usados para se referir às colunas da tabela."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Referência da coluna</th> <th>Significado</th> </tr></thead><tbody><tr> <td><em class="replaceable">[[<code>col_name</code>]]</em></td> <td>Coluna<em class="replaceable">[[<code>col_name</code>]]</em>de qualquer tabela usada na declaração que contenha uma coluna com esse nome</td> </tr><tr> <td><em class="replaceable">[[<code>tbl_name.col_name</code>]]</em></td> <td>Coluna<em class="replaceable">[[<code>col_name</code>]]</em>da mesa<em class="replaceable">[[<code>tbl_name</code>]]</em>do banco de dados padrão</td> </tr><tr> <td><em class="replaceable">[[<code>db_name.tbl_name.col_name</code>]]</em></td> <td>Coluna<em class="replaceable">[[<code>col_name</code>]]</em>da mesa<em class="replaceable">[[<code>tbl_name</code>]]</em>do banco de dados<em class="replaceable">[[<code>db_name</code>]]</em></td> </tr></tbody></table>

  Em outras palavras, um nome de coluna pode receber um qualificador de nome de tabela, que por sua vez pode receber um qualificador de nome de banco de dados. Exemplos de referências de coluna não qualificadas e qualificadas em instruções `SELECT`:

  ```sql
  SELECT c1 FROM mytable
  WHERE c2 > 100;

  SELECT mytable.c1 FROM mytable
  WHERE mytable.c2 > 100;

  SELECT mydb.mytable.c1 FROM mydb.mytable
  WHERE mydb.mytable.c2 > 100;
  ```

Você não precisa especificar um qualificador para uma referência a um objeto em uma declaração, a menos que a referência não qualificada seja ambígua. Suponha que a coluna `c1` ocorra apenas na tabela `t1`, `c2` apenas em `t2` e `c` em ambas `t1` e `t2`. Qualquer referência não qualificada a `c` é ambígua em uma declaração que se refere a ambas as tabelas e deve ser qualificada como `t1.c` ou `t2.c` para indicar qual tabela você quer:

```sql
SELECT c1, c2, t1.c FROM t1 INNER JOIN t2
WHERE t2.c > 100;
```

Da mesma forma, para recuperar de uma tabela `t` no banco de dados `db1` e de uma tabela `t` no banco de dados `db2` na mesma instrução, você deve qualificar as referências da tabela: Para referências a colunas dessas tabelas, os qualificadores são necessários apenas para os nomes de colunas que aparecem em ambas as tabelas. Suponha que a coluna `c1` ocorra apenas na tabela `db1.t`, `c2` apenas em `db2.t` e `c` em ambas `db1.t` e `db2.t`. Nesse caso, `c` é ambíguo e deve ser qualificado, mas `c1` e `c2` não precisam:

```sql
SELECT c1, c2, db1.t.c FROM db1.t INNER JOIN db2.t
WHERE db2.t.c > 100;
```

Os aliases de tabela permitem que referências de coluna qualificadas sejam escritas de forma mais simples:

```sql
SELECT c1, c2, t1.c FROM db1.t AS t1 INNER JOIN db2.t AS t2
WHERE t2.c > 100;
```
