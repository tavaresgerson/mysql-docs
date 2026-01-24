### 10.2.1 Repertório de Character Set

O repertório de um *character set* é a coleção de caracteres contidos no *set*.

Expressões de string possuem um atributo de repertório, que pode ter dois valores:

* `ASCII`: A expressão pode conter apenas caracteres ASCII; ou seja, caracteres no range Unicode de `U+0000` a `U+007F`.

* `UNICODE`: A expressão pode conter caracteres no range Unicode de `U+0000` a `U+10FFFF`. Isso inclui caracteres no range Basic Multilingual Plane (BMP) (`U+0000` a `U+FFFF`) e caracteres suplementares fora do range BMP (`U+10000` a `U+10FFFF`).

O range `ASCII` é um *subset* (subconjunto) do range `UNICODE`, então uma string com repertório `ASCII` pode ser convertida com segurança, sem perda de informação, para o *character set* de qualquer string com repertório `UNICODE`. Ela também pode ser convertida com segurança para qualquer *character set* que seja um *superset* (superconjunto) do *character set* `ascii`. (Todos os *character sets* do MySQL são *supersets* de `ascii`, com exceção de `swe7`, que reutiliza alguns caracteres de pontuação para caracteres acentuados suecos.)

O uso de repertório permite a conversão de *character set* em expressões para muitos casos em que o MySQL, de outra forma, retornaria um erro de "illegal mix of collations" (mistura ilegal de *collations*), quando as regras para *collation coercibility* são insuficientes para resolver ambiguidades. (Para informações sobre *coercibility*, consulte a Seção 10.8.4, “Collation Coercibility in Expressions”.)

A discussão a seguir fornece exemplos de expressões e seus repertórios, e descreve como o uso de repertório altera a avaliação de expressões de string:

* O repertório para uma constante de string depende do conteúdo da string e pode diferir do repertório do *character set* da string. Considere estas declarações:

  ```sql
  SET NAMES utf8; SELECT 'abc';
  SELECT _utf8'def';
  SELECT N'MySQL';
  ```

  Embora o *character set* seja `utf8` em cada um dos casos precedentes, as strings na verdade não contêm nenhum caractere fora do range ASCII, então seu repertório é `ASCII` em vez de `UNICODE`.

* Uma coluna que possui o *character set* `ascii` tem repertório `ASCII` por causa do seu *character set*. Na tabela a seguir, `c1` tem repertório `ASCII`:

  ```sql
  CREATE TABLE t1 (c1 CHAR(1) CHARACTER SET ascii);
  ```

  O exemplo a seguir ilustra como o repertório permite que um resultado seja determinado em um caso onde um erro ocorreria sem o repertório:

  ```sql
  CREATE TABLE t1 (
    c1 CHAR(1) CHARACTER SET latin1,
    c2 CHAR(1) CHARACTER SET ascii
  );
  INSERT INTO t1 VALUES ('a','b');
  SELECT CONCAT(c1,c2) FROM t1;
  ```

  Sem o repertório, este erro ocorre:

  ```sql
  ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
  and (ascii_general_ci,IMPLICIT) for operation 'concat'
  ```

  Usando o repertório, a conversão de *subset* para *superset* (`ascii` para `latin1`) pode ocorrer e um resultado é retornado:

  ```sql
  +---------------+
  | CONCAT(c1,c2) |
  +---------------+
  | ab            |
  +---------------+
  ```

* Funções com um argumento de string herdam o repertório do seu argumento. O resultado de `UPPER(_utf8'abc')` tem repertório `ASCII` porque seu argumento tem repertório `ASCII`. (Apesar do introdutor `_utf8`, a string `'abc'` não contém caracteres fora do range ASCII.)

* Para funções que retornam uma string, mas não possuem argumentos de string e usam `character_set_connection` como o *character set* de resultado, o repertório resultante é `ASCII` se `character_set_connection` for `ascii`, e `UNICODE` caso contrário:

  ```sql
  FORMAT(numeric_column, 4);
  ```

  O uso de repertório altera a forma como o MySQL avalia o exemplo a seguir:

  ```sql
  SET NAMES ascii;
  CREATE TABLE t1 (a INT, b VARCHAR(10) CHARACTER SET latin1);
  INSERT INTO t1 VALUES (1,'b');
  SELECT CONCAT(FORMAT(a, 4), b) FROM t1;
  ```

  Sem o repertório, este erro ocorre:

  ```sql
  ERROR 1267 (HY000): Illegal mix of collations (ascii_general_ci,COERCIBLE)
  and (latin1_swedish_ci,IMPLICIT) for operation 'concat'
  ```

  Com o repertório, um resultado é retornado:

  ```sql
  +-------------------------+
  | CONCAT(FORMAT(a, 4), b) |
  +-------------------------+
  | 1.0000b                 |
  +-------------------------+
  ```

* Funções com dois ou mais argumentos de string usam o repertório do argumento "mais amplo" para o repertório resultante, onde `UNICODE` é mais amplo que `ASCII`. Considere as seguintes chamadas `CONCAT()`:

  ```sql
  CONCAT(_ucs2 X'0041', _ucs2 X'0042')
  CONCAT(_ucs2 X'0041', _ucs2 X'00C2')
  ```

  Para a primeira chamada, o repertório é `ASCII` porque ambos os argumentos estão dentro do range ASCII. Para a segunda chamada, o repertório é `UNICODE` porque o segundo argumento está fora do range ASCII.

* O repertório para valores de retorno de função é determinado com base no repertório apenas daqueles argumentos que afetam o *character set* e a *collation* do resultado.

  ```sql
  IF(column1 < column2, 'smaller', 'greater')
  ```

  O repertório resultante é `ASCII` porque os dois argumentos de string (o segundo argumento e o terceiro argumento) ambos têm repertório `ASCII`. O primeiro argumento não importa para o repertório do resultado, mesmo que a expressão use valores de string.
