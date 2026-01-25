### 10.2.1 Repertório do Character Set

O Repertório de um Character Set é a coleção de caracteres nesse set.

Expressões de String possuem um atributo de Repertório, que pode ter dois valores:

* `ASCII`: A expressão pode conter apenas caracteres ASCII; ou seja, caracteres no range Unicode de `U+0000` a `U+007F`.

* `UNICODE`: A expressão pode conter caracteres no range Unicode de `U+0000` a `U+10FFFF`. Isso inclui caracteres no range do Plano Multilíngue Básico (BMP) (`U+0000` a `U+FFFF`) e caracteres suplementares fora do range BMP (`U+10000` a `U+10FFFF`).

O range `ASCII` é um subset do range `UNICODE`, portanto, uma String com Repertório `ASCII` pode ser convertida de forma segura, sem perda de informação, para o Character Set de qualquer String com Repertório `UNICODE`. Ela também pode ser convertida de forma segura para qualquer Character Set que seja um superset do Character Set `ascii`. (Todos os Character Sets do MySQL são supersets de `ascii`, com exceção de `swe7`, que reutiliza alguns caracteres de pontuação para caracteres acentuados suecos.)

O uso de Repertório permite a conversão de Character Set em expressões para muitos casos onde o MySQL, de outra forma, retornaria um erro de “illegal mix of collations” (mistura ilegal de Collation) quando as regras para Collation Coercibility são insuficientes para resolver ambiguidades. (Para informações sobre Coercibility, consulte a Seção 10.8.4, “Collation Coercibility em Expressões”.)

A discussão a seguir fornece exemplos de expressões e seus repertórios, e descreve como o uso de Repertório altera a avaliação da String expression:

* O Repertório para uma constante de String depende do conteúdo da String e pode diferir do Repertório do Character Set da String. Considere estas declarações (statements):

  ```sql
  SET NAMES utf8; SELECT 'abc';
  SELECT _utf8'def';
  SELECT N'MySQL';
  ```

  Embora o Character Set seja `utf8` em cada um dos casos precedentes, as Strings na verdade não contêm nenhum caractere fora do range ASCII, então seu Repertório é `ASCII` em vez de `UNICODE`.

* Uma coluna que possui o Character Set `ascii` tem Repertório `ASCII` devido ao seu Character Set. Na tabela a seguir, `c1` tem Repertório `ASCII`:

  ```sql
  CREATE TABLE t1 (c1 CHAR(1) CHARACTER SET ascii);
  ```

  O exemplo a seguir ilustra como o Repertório permite que um resultado seja determinado em um caso onde um erro ocorreria sem o Repertório:

  ```sql
  CREATE TABLE t1 (
    c1 CHAR(1) CHARACTER SET latin1,
    c2 CHAR(1) CHARACTER SET ascii
  );
  INSERT INTO t1 VALUES ('a','b');
  SELECT CONCAT(c1,c2) FROM t1;
  ```

  Sem o Repertório, este erro ocorre:

  ```sql
  ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
  and (ascii_general_ci,IMPLICIT) for operation 'concat'
  ```

  Usando o Repertório, a conversão de subset para superset (`ascii` para `latin1`) pode ocorrer e um resultado é retornado:

  ```sql
  +---------------+
  | CONCAT(c1,c2) |
  +---------------+
  | ab            |
  +---------------+
  ```

* Functions (Funções) com um argumento String herdam o Repertório de seu argumento. O resultado de `UPPER(_utf8'abc')` tem Repertório `ASCII` porque seu argumento tem Repertório `ASCII`. (Apesar do introducer `_utf8`, a String `'abc'` não contém caracteres fora do range ASCII.)

* Para Functions que retornam uma String, mas não possuem argumentos String e usam `character_set_connection` como o Character Set do resultado, o Repertório do resultado é `ASCII` se `character_set_connection` for `ascii`, e `UNICODE` caso contrário:

  ```sql
  FORMAT(numeric_column, 4);
  ```

  O uso de Repertório altera como o MySQL avalia o seguinte exemplo:

  ```sql
  SET NAMES ascii;
  CREATE TABLE t1 (a INT, b VARCHAR(10) CHARACTER SET latin1);
  INSERT INTO t1 VALUES (1,'b');
  SELECT CONCAT(FORMAT(a, 4), b) FROM t1;
  ```

  Sem o Repertório, este erro ocorre:

  ```sql
  ERROR 1267 (HY000): Illegal mix of collations (ascii_general_ci,COERCIBLE)
  and (latin1_swedish_ci,IMPLICIT) for operation 'concat'
  ```

  Com o Repertório, um resultado é retornado:

  ```sql
  +-------------------------+
  | CONCAT(FORMAT(a, 4), b) |
  +-------------------------+
  | 1.0000b                 |
  +-------------------------+
  ```

* Functions com dois ou mais argumentos String usam o Repertório do argumento “mais amplo” para o Repertório do resultado, onde `UNICODE` é mais amplo que `ASCII`. Considere as seguintes chamadas `CONCAT()`:

  ```sql
  CONCAT(_ucs2 X'0041', _ucs2 X'0042')
  CONCAT(_ucs2 X'0041', _ucs2 X'00C2')
  ```

  Para a primeira chamada, o Repertório é `ASCII` porque ambos os argumentos estão dentro do range ASCII. Para a segunda chamada, o Repertório é `UNICODE` porque o segundo argumento está fora do range ASCII.

* O Repertório para valores de retorno de Function é determinado com base no Repertório apenas daqueles argumentos que afetam o Character Set e a Collation do resultado.

  ```sql
  IF(column1 < column2, 'smaller', 'greater')
  ```

  O Repertório do resultado é `ASCII` porque os dois argumentos String (o segundo argumento e o terceiro argumento) ambos têm Repertório `ASCII`. O primeiro argumento não importa para o Repertório do resultado, mesmo que a expressão use valores String.