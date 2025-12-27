### 13.1.1 Sintaxe do Tipo de Dados Numérico

Para os tipos de dados inteiros, *`M`* indica a largura mínima de exibição. A largura máxima de exibição é de 255. A largura de exibição não está relacionada ao intervalo de valores que um tipo pode armazenar, conforme descrito na Seção 13.1.6, “Atributos do Tipo Numérico”.

Para os tipos de dados de ponto flutuante e ponto fixo, *`M`* é o número total de dígitos que podem ser armazenados.

O atributo de largura de exibição é desatualizado para tipos de dados inteiros; você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL.

Se você especificar `ZEROFILL` para uma coluna numérica, o MySQL adiciona automaticamente o atributo `UNSIGNED` à coluna.

O atributo `ZEROFILL` é desatualizado para tipos de dados numéricos; você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL. Considere usar um meio alternativo para produzir o efeito deste atributo. Por exemplo, as aplicações podem usar a função `LPAD()` para zero-padar números até a largura desejada, ou podem armazenar os números formatados em colunas `CHAR`.

Tipos de dados numéricos que permitem o atributo `UNSIGNED` também permitem `SIGNED`. No entanto, esses tipos de dados são assinados por padrão, então o atributo `SIGNED` não tem efeito.

O atributo `UNSIGNED` é desatualizado para colunas do tipo `FLOAT` (FLOAT, DOUBLE"), `DOUBLE` (FLOAT, DOUBLE"), e `DECIMAL` (DECIMAL, NUMERIC") (e quaisquer sinônimos); você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL. Considere usar uma restrição simples `CHECK` em vez disso para tais colunas.

`SERIAL` é um alias para `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

`SERIAL DEFAULT VALUE` na definição de uma coluna inteira é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Aviso

Quando você usa subtração entre valores inteiros onde um é do tipo `UNSIGNED`, o resultado é não assinado, a menos que o modo SQL `NO_UNSIGNED_SUBTRACTION` esteja habilitado. Veja a Seção 14.10, “Funções e Operadores de Cast”.

*  `BIT[(M)]`

Um tipo de valor de bit. *`M`* indica o número de bits por valor, de 1 a 64. O padrão é 1 se *`M`* for omitido.
* `TINYINT[(M)] [UNSIGNED] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um inteiro muito pequeno. A faixa de valores assinados é de `-128` a `127`. A faixa de valores não assinados é de `0` a `255`.
*  `BOOL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `BOOLEAN` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Esses tipos são sinônimos de `TINYINT(1)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Um valor de zero é considerado falso. Valores não nulos são considerados verdadeiros:

  ```
  mysql> SELECT IF(0, 'true', 'false');
  +------------------------+
  | IF(0, 'true', 'false') |
  +------------------------+
  | false                  |
  +------------------------+

  mysql> SELECT IF(1, 'true', 'false');
  +------------------------+
  | IF(1, 'true', 'false') |
  +------------------------+
  | true                   |
  +------------------------+

  mysql> SELECT IF(2, 'true', 'false');
  +------------------------+
  | IF(2, 'true', 'false') |
  +------------------------+
  | true                   |
  +------------------------+
  ```

  No entanto, os valores `TRUE` e `FALSE` são meramente aliases para `1` e `0`, respectivamente, como mostrado aqui:

  ```
  mysql> SELECT IF(0 = FALSE, 'true', 'false');
  +--------------------------------+
  | IF(0 = FALSE, 'true', 'false') |
  +--------------------------------+
  | true                           |
  +--------------------------------+

  mysql> SELECT IF(1 = TRUE, 'true', 'false');
  +-------------------------------+
  | IF(1 = TRUE, 'true', 'false') |
  +-------------------------------+
  | true                          |
  +-------------------------------+

  mysql> SELECT IF(2 = TRUE, 'true', 'false');
  +-------------------------------+
  | IF(2 = TRUE, 'true', 'false') |
  +-------------------------------+
  | false                         |
  +-------------------------------+

  mysql> SELECT IF(2 = FALSE, 'true', 'false');
  +--------------------------------+
  | IF(2 = FALSE, 'true', 'false') |
  +--------------------------------+
  | false                          |
  +--------------------------------+
  ```

  As duas últimas declarações exibem os resultados mostrados porque `2` não é igual a `1` nem a `0`.
* `SMALLINT[(M)] [UNSIGNED] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um inteiro pequeno. A faixa de valores assinados é de `-32768` a `32767`. A faixa de valores não assinados é de `0` a `65535`.
* `MEDIUMINT[(M)] [UNSIGNED] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um inteiro de tamanho médio. A faixa de valores assinados é de `-8388608` a `8388607`. A faixa de valores não assinados é de `0` a `16777215`.
* `INT[(M)] [UNSIGNED] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um inteiro de tamanho normal. A faixa de valores assinados é de `-2147483648` a `2147483647`. A faixa de valores não assinados é de `0` a `4294967295`.
* `INTEGER[(M)] [UNSIGNED] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Este tipo é um sinônimo de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").
* `BIGINT[(M)] [UNSIGNED] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um grande inteiro. A faixa de valores assinados é de `-9223372036854775808` a `9223372036854775807`. A faixa de valores não assinados é de `0` a `18446744073709551615`.

  `SERIAL` é um alias para `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

Algumas coisas que você deve saber sobre as colunas `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") :

  + Toda a aritmética é realizada usando valores `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DOUBLE` - FLOAT, DOUBLE") assinados, portanto, você não deve usar inteiros não assinados maiores que `9223372036854775807` (63 bits), exceto com funções de bits! Se você fizer isso, alguns dos últimos dígitos no resultado podem estar errados devido a erros de arredondamento ao converter um valor `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para um `DOUBLE` - FLOAT, DOUBLE").

    O MySQL pode lidar com  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") nos seguintes casos:

    - Ao usar inteiros para armazenar grandes valores não assinados em uma coluna  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")
    - Em `MIN(col_name)` ou `MAX(col_name)`, onde *`col_name`* se refere a uma coluna  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")
    - Ao usar operadores ( `+`, `-`, `*`, e assim por diante) onde ambos os operandos são inteiros.
  + Você sempre pode armazenar um valor inteiro exato em uma coluna  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") armazenando-o usando uma string. Neste caso, o MySQL realiza uma conversão de string para número que não envolve uma representação de dupla precisão intermediária.
  + Os operadores  `-`, `+`, e `*` usam aritmética `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") quando ambos os operandos são valores inteiros. Isso significa que, se você multiplicar dois inteiros grandes (ou resultados de funções que retornam inteiros), você pode obter resultados inesperados quando o resultado for maior que `9223372036854775807`.
[`DECIMAL[(M[,D])]

Um número fixo "exato". *`M`* é o número total de dígitos (a precisão) e *`D`* é o número de dígitos após a vírgula decimal (a escala). O ponto decimal e (para números negativos) o sinal `-` não são contados em *`M`*. Se *`D`* for 0, os valores não têm ponto decimal ou parte fracionária. O número máximo de dígitos (*`M`*) para `DECIMAL` - DECIMAL, NUMERIC") é 65. O número máximo de casas decimais suportadas (*`D`*) é 30. Se *`D`* for omitido, o padrão é 0. Se *`M`* for omitido, o padrão é 10. (Há também um limite para o comprimento do texto dos literais `DECIMAL` - DECIMAL, NUMERIC") - veja a Seção 14.24.3, “Tratamento de Expressões.”)

`UNSIGNED`, se especificado, impede valores negativos. O atributo `UNSIGNED` é desatualizado para colunas do tipo `DECIMAL` - DECIMAL, NUMERIC") (e quaisquer sinônimos); você deve esperar que o suporte seja removido em uma versão futura do MySQL. Considere usar uma restrição simples `CHECK` em vez disso para tais colunas.

Todos os cálculos básicos (`+, -, *, /`) com colunas `DECIMAL` - DECIMAL, NUMERIC") são feitos com uma precisão de 65 dígitos. `DEC[(M[,D])]

Esses tipos são sinônimos de `DECIMAL` - DECIMAL, NUMERIC"). O sinônimo `FIXED` - DECIMAL, NUMERIC") está disponível para compatibilidade com outros sistemas de banco de dados.

* `FLOAT[(M,D)] [UNSIGNED] [ZEROFILL]` - FLOAT, DOUBLE")

Um número de ponto flutuante pequeno (de precisão simples). Os valores permitidos são `-3.402823466E+38` a `-1.175494351E-38`, `0` e `1.175494351E-38` a `3.402823466E+38`. Estes são os limites teóricos, baseados no padrão IEEE. A faixa real pode ser ligeiramente menor dependendo do seu hardware ou sistema operacional.

*`M`* é o número total de dígitos e *`D`* é o número de dígitos após a vírgula decimal. Se *`M`* e *`D`* forem omitidos, os valores são armazenados nos limites permitidos pelo hardware. Um número de ponto flutuante de precisão simples é preciso aproximadamente a 7 casas decimais.

`FLOAT(M,D)` é uma extensão MySQL não padrão. Essa sintaxe está desatualizada e você deve esperar que o suporte a ela seja removido em uma versão futura do MySQL.

`UNSIGNED`, se especificado, impede valores negativos. O atributo `UNSIGNED` está desatualizado para colunas do tipo `FLOAT` - FLOAT, DOUBLE") (e quaisquer sinônimos) e você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

Usar `FLOAT` - FLOAT, DOUBLE") pode causar alguns problemas inesperados, pois todos os cálculos no MySQL são feitos com precisão dupla. Veja a Seção B.3.4.7, “Resolvendo Problemas com Nenhuma Linha de Correspondência”.
* `FLOAT(p) [UNSIGNED] [ZEROFILL]` - FLOAT, DOUBLE")

Um número de ponto flutuante. *`p`* representa a precisão em bits, mas o MySQL usa esse valor apenas para determinar se usar `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") para o tipo de dado resultante. Se *`p`* estiver entre 0 e 24, o tipo de dado se torna  `FLOAT` - FLOAT, DOUBLE") sem valores de *`M`* ou *`D`*. Se *`p`* estiver entre 25 e 53, o tipo de dado se torna  `DOUBLE` - FLOAT, DOUBLE") sem valores de *`M`* ou *`D`*. A faixa da coluna resultante é a mesma que para os tipos de dados `FLOAT` - FLOAT, DOUBLE") de precisão simples ou `DOUBLE` - FLOAT, DOUBLE") de precisão dupla descritos anteriormente nesta seção.

`UNSIGNED`, se especificado, impede valores negativos. O atributo `UNSIGNED` está desatualizado para colunas do tipo `FLOAT` - FLOAT, DOUBLE") (e quaisquer sinônimos) e você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

A sintaxe `FLOAT(p)` - FLOAT, DOUBLE") é fornecida para compatibilidade com ODBC.
* `DOUBLE[(M,D)] [UNSIGNED] [ZEROFILL]` - FLOAT, DOUBLE")

Um número de ponto flutuante de tamanho normal (dupla precisão). Os valores permitidos são `-1.7976931348623157E+308` a `-2.2250738585072014E-308`, `0` e `2.2250738585072014E-308` a `1.7976931348623157E+308`. Estes são os limites teóricos, com base no padrão IEEE. A faixa real pode ser ligeiramente menor, dependendo do seu hardware ou sistema operacional.

*`M`* é o número total de dígitos e *`D`* é o número de dígitos após a vírgula. Se `M` e `D` forem omitidos, os valores são armazenados nos limites permitidos pelo hardware. Um número de ponto flutuante de dupla precisão é preciso aproximadamente a 15 casas decimais.

`DOUBLE(M,D)` é uma extensão MySQL não padrão; e está desatualizada. Você deve esperar que o suporte para esta sintaxe seja removido em uma versão futura do MySQL.

`UNSIGNED`, se especificado, impede valores negativos. O atributo `UNSIGNED` está desatualizado para colunas do tipo `DOUBLE` - FLOAT, DOUBLE") e você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.
* `DOUBLE PRECISION[(M,D)] [UNSIGNED] [ZEROFILL]` - FLOAT, DOUBLE"), `REAL[(M,D)] [UNSIGNED] [ZEROFILL]` - FLOAT, DOUBLE")

Estes tipos são sinônimos de `DOUBLE` - FLOAT, DOUBLE"). Exceção: Se o modo SQL `REAL_AS_FLOAT` estiver habilitado, `REAL` - FLOAT, DOUBLE") é um sinônimo de `FLOAT` - FLOAT, DOUBLE") em vez de `DOUBLE` - FLOAT, DOUBLE").