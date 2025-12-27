### 11.2.2 Identificadores Qualificadores

Os nomes de objetos podem ser não qualificados ou qualificados. Um nome não qualificado é permitido em contextos onde a interpretação do nome é inequívoca. Um nome qualificado inclui pelo menos um qualificador para esclarecer o contexto interpretativo, substituindo um contexto padrão ou fornecendo um contexto ausente.

Por exemplo, esta declaração cria uma tabela usando o nome não qualificado `t1`:

```
CREATE TABLE t1 (i INT);
```

Como `t1` não inclui nenhum qualificador para especificar um banco de dados, a declaração cria a tabela no banco de dados padrão. Se não houver banco de dados padrão, ocorre um erro.

Esta declaração cria uma tabela usando o nome qualificado `db1.t1`:

```
CREATE TABLE db1.t1 (i INT);
```

Como `db1.t1` inclui um qualificador de banco de dados `db1`, a declaração cria `t1` no banco de dados denominado `db1`, independentemente do banco de dados padrão. O qualificador *deve* ser especificado se não houver banco de dados padrão. O qualificador *pode* ser especificado se houver um banco de dados padrão, para especificar um banco de dados diferente do padrão, ou para tornar o banco de dados explícito se o padrão for o mesmo que o especificado.

Os qualificadores têm essas características:

* Um nome não qualificado consiste em um único identificador. Um nome qualificado consiste em múltiplos identificadores.

* Os componentes de um nome de múltiplos partes devem ser separados por caracteres de ponto (`.`) . As partes iniciais de um nome de múltiplos partes atuam como qualificadores que afetam o contexto dentro do qual a interpretação do identificador final deve ser realizada.

* O caractere qualificador é um token separado e não precisa estar contiguo aos identificadores associados. Por exemplo, *`tbl_name.col_name`* e *`tbl_name . col_name`* são equivalentes.

* Se algum componente de um nome de várias partes exigir aspas, as aspas devem ser usadas individualmente, em vez de citar o nome como um todo. Por exemplo, escreva `` `minha-tabela`.`minha-coluna` ``, não `` `minha-tabela.minha-coluna` ``.

* Uma palavra reservada que segue um ponto em um nome qualificado deve ser um identificador, portanto, nesse contexto, não precisa ser citada.

Os qualificadores permitidos para nomes de objetos dependem do tipo do objeto:

* O nome de uma base de dados é totalmente qualificado e não aceita nenhum qualificador:

  ```
  CREATE DATABASE db1;
  ```

* O nome de uma tabela, visualização ou programa armazenado pode receber um qualificador de nome de base de dados. Exemplos de nomes não qualificados e qualificados em declarações `CREATE`:

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

* Um gatilho está associado a uma tabela, portanto, qualquer qualificador se aplica ao nome da tabela:

  ```
  CREATE TRIGGER mytrigger ... ON mytable ...;

  CREATE TRIGGER mytrigger ... ON mydb.mytable ...;
  ```

* O nome de uma coluna pode receber vários qualificadores para indicar o contexto em declarações que a referenciam, conforme mostrado na tabela a seguir.

<table summary="Formas de referência de colunas que podem ser usadas para se referir às colunas da tabela."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Referência da Coluna</th> <th>Significado</th> </tr></thead><tbody><tr> <td><em class="substituível"><code>col_name</code></em></td> <td>Coluna <em class="substituível"><code>col_name</code></em> da tabela que foi usada na declaração contém uma coluna com esse nome</td> </tr><tr> <td><em class="substituível"><code>tbl_name.col_name</code></em></td> <td>Coluna <em class="substituível"><code>col_name</code></em> da tabela <em class="substituível"><code>tbl_name</code></em> do banco de dados padrão</td> </tr><tr> <td><em class="substituível"><code>db_name.tbl_name.col_name</code></em></td> <td>Coluna <em class="substituível"><code>col_name</code></em> da tabela <em class="substituível"><code>tbl_name</code></em> do banco de dados <em class="substituível"><code>db_name</code></em></td> </tr></tbody></table>

Em outras palavras, um nome de coluna pode ser atribuído a um qualificador de nome de tabela, que por sua vez pode ser atribuído a um qualificador de nome de banco de dados. Exemplos de referências de colunas não qualificadas e qualificadas em declarações `SELECT`:

```
  SELECT c1 FROM mytable
  WHERE c2 > 100;

  SELECT mytable.c1 FROM mytable
  WHERE mytable.c2 > 100;

  SELECT mydb.mytable.c1 FROM mydb.mytable
  WHERE mydb.mytable.c2 > 100;
  ```

Você não precisa especificar um qualificador para uma referência de objeto em uma declaração, a menos que a referência não qualificada seja ambígua. Suponha que a coluna `c1` ocorre apenas na tabela `t1`, `c2` apenas em `t2`, e `c` em ambas `t1` e `t2`. Qualquer referência não qualificada para `c` é ambígua em uma declaração que se refere a ambas as tabelas e deve ser qualificada como `t1.c` ou `t2.c` para indicar qual tabela você quer:

```
SELECT c1, c2, t1.c FROM t1 INNER JOIN t2
WHERE t2.c > 100;
```4ODNjRxvw2```
SELECT c1, c2, db1.t.c FROM db1.t INNER JOIN db2.t
WHERE db2.t.c > 100;
```VoJIHpXc9z```