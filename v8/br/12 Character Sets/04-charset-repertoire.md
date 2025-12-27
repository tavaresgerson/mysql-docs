### 12.2.1 Repertório de Caracteres

O repertório de um conjunto de caracteres é a coleção de caracteres no conjunto.

As expressões de string têm um atributo de repertório, que pode ter dois valores:

* `ASCII`: A expressão pode conter apenas caracteres ASCII; ou seja, caracteres no intervalo Unicode `U+0000` a `U+007F`.
* `UNICODE`: A expressão pode conter caracteres no intervalo Unicode `U+0000` a `U+10FFFF`. Isso inclui caracteres no intervalo da Plana Multilíngue Básica (BMP) (`U+0000` a `U+FFFF`) e caracteres suplementares fora do intervalo BMP (`U+10000` a `U+10FFFF`).

O intervalo `ASCII` é um subconjunto do intervalo `UNICODE`, portanto, uma string com repertório `ASCII` pode ser convertida com segurança, sem perda de informações, para o conjunto de caracteres de qualquer string com repertório `UNICODE`. Também pode ser convertido com segurança para qualquer conjunto de caracteres que seja um superconjunto do conjunto de caracteres `ascii`. (Todos os conjuntos de caracteres MySQL são superconjuntos de `ascii`, com exceção de `swe7`, que reutiliza alguns caracteres de pontuação para caracteres acentuados suecos.)

O uso do repertório permite a conversão de conjuntos de caracteres em expressões para muitos casos em que o MySQL, de outra forma, retornaria um erro de "mistura ilegal de colunas" quando as regras para coercibilidade de colunas forem insuficientes para resolver ambiguidades. (Para informações sobre coercibilidade, consulte a Seção 12.8.4, “Coercibilidade de Colunas em Expressões”.)

A discussão a seguir fornece exemplos de expressões e seus repertórios, e descreve como o uso do repertório altera a avaliação de expressões de string:

* O repertório de uma constante de string depende do conteúdo da string e pode diferir do repertório do conjunto de caracteres da string. Considere estas declarações:

  ```
  SET NAMES utf8mb4; SELECT 'abc';
  SELECT _utf8mb4'def';
  ```

Embora o conjunto de caracteres seja `utf8mb4` em cada um dos casos anteriores, as strings não contêm, na verdade, nenhum caractere fora do intervalo ASCII, portanto, seu repertório é `ASCII`, e não `UNICODE`.
* Uma coluna com o conjunto de caracteres `ascii` tem repertório `ASCII` devido ao seu conjunto de caracteres. Na tabela a seguir, `c1` tem repertório `ASCII`:

  ```
  CREATE TABLE t1 (c1 CHAR(1) CHARACTER SET ascii);
  ```
O seguinte exemplo ilustra como o repertório permite determinar um resultado em um caso em que ocorre um erro sem repertório:

  ```
  CREATE TABLE t1 (
    c1 CHAR(1) CHARACTER SET latin1,
    c2 CHAR(1) CHARACTER SET ascii
  );
  INSERT INTO t1 VALUES ('a','b');
  SELECT CONCAT(c1,c2) FROM t1;
  ```
Sem repertório, ocorre este erro:

  ```
  ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
  and (ascii_general_ci,IMPLICIT) for operation 'concat'
  ```
Usando o repertório, a conversão de subconjunto para superconjunto (`ascii` para `latin1`) pode ocorrer e um resultado é retornado:

  ```
  +---------------+
  | CONCAT(c1,c2) |
  +---------------+
  | ab            |
  +---------------+
  ```
* Funções com um argumento de string herdam o repertório de seu argumento. O resultado de `UPPER(_utf8mb4'abc')` tem repertório `ASCII` porque seu argumento tem repertório `ASCII`. (Apesar do `_utf8mb4` introduzir, a string `'abc'` não contém nenhum caractere fora do intervalo ASCII.)
* Para funções que retornam uma string, mas não têm argumentos de string e usam `character_set_connection` como o conjunto de caracteres do resultado, o repertório do resultado é `ASCII` se `character_set_connection` for `ascii`, e `UNICODE` caso contrário:

  ```
  FORMAT(numeric_column, 4);
  ```
O uso do repertório altera como o MySQL avalia o seguinte exemplo:

  ```
  SET NAMES ascii;
  CREATE TABLE t1 (a INT, b VARCHAR(10) CHARACTER SET latin1);
  INSERT INTO t1 VALUES (1,'b');
  SELECT CONCAT(FORMAT(a, 4), b) FROM t1;
  ```
Sem repertório, ocorre este erro:

  ```
  ERROR 1267 (HY000): Illegal mix of collations (ascii_general_ci,COERCIBLE)
  and (latin1_swedish_ci,IMPLICIT) for operation 'concat'
  ```
Com repertório, um resultado é retornado:

  ```
  +-------------------------+
  | CONCAT(FORMAT(a, 4), b) |
  +-------------------------+
  | 1.0000b                 |
  +-------------------------+
  ```
* Funções com dois ou mais argumentos de string usam o repertório do argumento mais amplo para o repertório do resultado, onde `UNICODE` é mais amplo que `ASCII`. Considere as seguintes chamadas de `CONCAT()`:

  ```
  CONCAT(_ucs2 X'0041', _ucs2 X'0042')
  CONCAT(_ucs2 X'0041', _ucs2 X'00C2')
  ```

Para a primeira chamada, o repertório é `ASCII` porque ambos os argumentos estão dentro do intervalo ASCII. Para a segunda chamada, o repertório é `UNICODE` porque o segundo argumento está fora do intervalo ASCII.
* O repertório para os valores de retorno da função é determinado com base no repertório apenas dos argumentos que afetam o conjunto de caracteres e a ordenação do resultado.

```
  IF(column1 < column2, 'smaller', 'greater')
  ```

O repertório do resultado é `ASCII` porque os dois argumentos de string (o segundo argumento e o terceiro argumento) têm o repertório `ASCII`. O primeiro argumento não importa para o repertório do resultado, mesmo que a expressão use valores de string.