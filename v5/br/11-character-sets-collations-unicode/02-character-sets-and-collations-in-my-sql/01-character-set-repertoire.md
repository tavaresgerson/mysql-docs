### 10.2.1 Repertório de Caracteres

O repertório de um conjunto de caracteres é a coleção de caracteres no conjunto.

As expressões de cadeia têm um atributo repertoire, que pode ter dois valores:

- `ASCII`: A expressão pode conter apenas caracteres ASCII; ou seja, caracteres no intervalo Unicode `U+0000` a `U+007F`.

- `UNICODE`: A expressão pode conter caracteres no intervalo Unicode `U+0000` a `U+10FFFF`. Isso inclui caracteres no intervalo da Planilha Multilíngue Básica (BMP) (`U+0000` a `U+FFFF`) e caracteres suplementares fora do intervalo da BMP (`U+10000` a `U+10FFFF`).

A faixa `ASCII` é um subconjunto da faixa `UNICODE`, portanto, uma string com o repertório `ASCII` pode ser convertida com segurança, sem perda de informações, para o conjunto de caracteres de qualquer string com o repertório `UNICODE`. Também pode ser convertida com segurança para qualquer conjunto de caracteres que seja um superconjunto do conjunto de caracteres `ascii`. (Todos os conjuntos de caracteres do MySQL são superconjuntos de `ascii`, com exceção de `swe7`, que reutiliza alguns caracteres de pontuação para caracteres acentuados suecos.)

O uso do repertório permite a conversão do conjunto de caracteres em expressões para muitos casos em que o MySQL, de outra forma, retornaria um erro de “mistura ilegal de colatações” quando as regras para a coercibilidade da colatação forem insuficientes para resolver ambiguidades. (Para informações sobre coercibilidade, consulte a Seção 10.8.4, “Coercibilidade da Colatação em Expressões”.)

A discussão a seguir fornece exemplos de expressões e seus repertórios, e descreve como o uso do repertório altera a avaliação da expressão de cadeia.

- O repertório para uma constante de cadeia depende do conteúdo da cadeia e pode diferir do repertório do conjunto de caracteres de cadeia. Considere as seguintes declarações:

  ```sql
  SET NAMES utf8; SELECT 'abc';
  SELECT _utf8'def';
  SELECT N'MySQL';
  ```

  Embora o conjunto de caracteres seja `utf8` em cada um dos casos anteriores, as strings não contêm, na verdade, nenhum caractere fora da faixa ASCII, portanto, seu repertório é `ASCII` em vez de `UNICODE`.

- Uma coluna com o conjunto de caracteres `ascii` tem o repertório `ASCII` devido ao seu conjunto de caracteres. Na tabela a seguir, `c1` tem o repertório `ASCII`:

  ```sql
  CREATE TABLE t1 (c1 CHAR(1) CHARACTER SET ascii);
  ```

  O exemplo a seguir ilustra como o repertório permite determinar um resultado em um caso em que ocorre um erro sem repertório:

  ```sql
  CREATE TABLE t1 (
    c1 CHAR(1) CHARACTER SET latin1,
    c2 CHAR(1) CHARACTER SET ascii
  );
  INSERT INTO t1 VALUES ('a','b');
  SELECT CONCAT(c1,c2) FROM t1;
  ```

  Sem repertório, esse erro ocorre:

  ```sql
  ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
  and (ascii_general_ci,IMPLICIT) for operation 'concat'
  ```

  A conversão de um repertório de subconjunto para superconjunto (`ascii` para `latin1`) pode ocorrer e um resultado é retornado:

  ```sql
  +---------------+
  | CONCAT(c1,c2) |
  +---------------+
  | ab            |
  +---------------+
  ```

- Funções com um argumento de string herdam o repertório de seu argumento. O resultado de `UPPER(_utf8'abc')` tem o repertório `ASCII` porque seu argumento tem o repertório `ASCII` (Apesar da introdução de `_utf8`, a string `'abc'` não contém caracteres fora da faixa ASCII.)

- Para funções que retornam uma string, mas não têm argumentos de string e usam `character_set_connection` como o conjunto de caracteres de resultado, o repertório de resultado é `ASCII` se `character_set_connection` for `ascii` e `UNICODE` caso contrário:

  ```sql
  FORMAT(numeric_column, 4);
  ```

  O uso do repertório altera a forma como o MySQL avalia o seguinte exemplo:

  ```sql
  SET NAMES ascii;
  CREATE TABLE t1 (a INT, b VARCHAR(10) CHARACTER SET latin1);
  INSERT INTO t1 VALUES (1,'b');
  SELECT CONCAT(FORMAT(a, 4), b) FROM t1;
  ```

  Sem repertório, esse erro ocorre:

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

- Funções com dois ou mais argumentos de string utilizam o repertório de argumentos "mais amplo" para o repertório de resultados, onde `UNICODE` é mais amplo que `ASCII`. Considere as seguintes chamadas de `CONCAT()`:

  ```sql
  CONCAT(_ucs2 X'0041', _ucs2 X'0042')
  CONCAT(_ucs2 X'0041', _ucs2 X'00C2')
  ```

  Para a primeira chamada, o repertório é `ASCII` porque ambos os argumentos estão dentro da faixa ASCII. Para a segunda chamada, o repertório é `UNICODE` porque o segundo argumento está fora da faixa ASCII.

- O repertório para os valores de retorno de função é determinado com base no repertório apenas dos argumentos que afetam o conjunto de caracteres e a ordenação do resultado.

  ```sql
  IF(column1 < column2, 'smaller', 'greater')
  ```

  O repertório de resultado é `ASCII` porque os dois argumentos de string (o segundo argumento e o terceiro argumento) têm o mesmo repertório `ASCII`. O primeiro argumento não importa para o repertório de resultado, mesmo que a expressão use valores de string.
