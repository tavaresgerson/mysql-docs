### 11.1.1 Sintaxe de Tipos de Dados Numéricos

Para tipos de dados inteiros, *`M`* indica a largura mínima de exibição. A largura máxima de exibição é 255. A largura de exibição não está relacionada ao intervalo de valores que um tipo pode armazenar, conforme descrito na Seção 11.1.6, “Atributos de Tipo Numérico”.

Para tipos de dados de ponto flutuante e de ponto fixo, *`M`* é o número total de dígitos que podem ser armazenados.

Se você especificar `ZEROFILL` para uma coluna numérica, o MySQL adiciona automaticamente o atributo `UNSIGNED` à coluna.

Tipos de dados numéricos que permitem o atributo `UNSIGNED` também permitem `SIGNED`. No entanto, esses tipos de dados são signed (com sinal) por padrão, portanto, o atributo `SIGNED` não tem efeito.

`SERIAL` é um alias para `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

`SERIAL DEFAULT VALUE` na definição de uma coluna inteira é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Aviso

Ao usar a subtração entre valores inteiros onde um é do tipo `UNSIGNED`, o resultado é unsigned (sem sinal), a menos que o modo SQL `NO_UNSIGNED_SUBTRACTION` esteja habilitado. Consulte a Seção 12.10, “Funções e Operadores de Cast”.

* `BIT[(M)]`

  Um tipo de valor de bit. *`M`* indica o número de bits por valor, de 1 a 64. O padrão é 1 se *`M`* for omitido.

* `TINYINT[(M)] [UNSIGNED] [ZEROFILL]`

  Um inteiro muito pequeno. O intervalo signed é de `-128` a `127`. O intervalo unsigned é de `0` a `255`.

* `BOOL`, `BOOLEAN`

  Esses tipos são sinônimos de `TINYINT(1)`. Um valor zero é considerado false. Valores não zero são considerados true:

  ```sql
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

  No entanto, os valores `TRUE` e `FALSE` são meramente aliases para `1` e `0`, respectivamente, conforme mostrado aqui:

  ```sql
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

  As últimas duas instruções exibem os resultados mostrados porque `2` não é igual a `1` nem a `0`.

* `SMALLINT[(M)] [UNSIGNED] [ZEROFILL]`

  Um inteiro pequeno. O intervalo signed é de `-32768` a `32767`. O intervalo unsigned é de `0` a `65535`.

* `MEDIUMINT[(M)] [UNSIGNED] [ZEROFILL]`

  Um inteiro de tamanho médio. O intervalo signed é de `-8388608` a `8388607`. O intervalo unsigned é de `0` a `16777215`.

* `INT[(M)] [UNSIGNED] [ZEROFILL]`

  Um inteiro de tamanho normal. O intervalo signed é de `-2147483648` a `2147483647`. O intervalo unsigned é de `0` a `4294967295`.

* `INTEGER[(M)] [UNSIGNED] [ZEROFILL]`

  Este tipo é um sinônimo para `INT`.

* `BIGINT[(M)] [UNSIGNED] [ZEROFILL]`

  Um inteiro grande. O intervalo signed é de `-9223372036854775808` a `9223372036854775807`. O intervalo unsigned é de `0` a `18446744073709551615`.

  `SERIAL` é um alias para `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

  Algumas coisas que você deve estar ciente em relação às colunas `BIGINT`:

  + Toda a aritmética é feita usando valores `BIGINT` signed ou `DOUBLE`, então você não deve usar big integers unsigned maiores que `9223372036854775807` (63 bits), exceto com funções de bit! Se você fizer isso, alguns dos últimos dígitos no resultado podem estar errados devido a erros de arredondamento ao converter um valor `BIGINT` para um `DOUBLE`.

    O MySQL pode lidar com `BIGINT` nos seguintes casos:

    - Ao usar integers para armazenar grandes valores unsigned em uma coluna `BIGINT`.

    - Em `MIN(col_name)` ou `MAX(col_name)`, onde *`col_name`* se refere a uma coluna `BIGINT`.

    - Ao usar operadores (`+`, `-`, `*`, e assim por diante) onde ambos os operandos são integers.

  + Você sempre pode armazenar um valor inteiro exato em uma coluna `BIGINT` armazenando-o usando uma string. Neste caso, o MySQL executa uma conversão de string para número que não envolve representação intermediária de precisão double.

  + Os operadores `-`, `+` e `*` usam aritmética `BIGINT` quando ambos os operandos são valores inteiros. Isso significa que, se você multiplicar dois big integers (ou resultados de funções que retornam integers), você pode obter resultados inesperados quando o resultado for maior que `9223372036854775807`.

* [`DECIMAL[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "11.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC")

  Um número de ponto fixo “exato” packed. *`M`* é o número total de dígitos (a precisão) e *`D`* é o número de dígitos após o ponto decimal (a escala). O ponto decimal e (para números negativos) o sinal `-` não são contados em *`M`*. Se *`D`* for 0, os valores não têm ponto decimal ou parte fracionária. O número máximo de dígitos (*`M`*) para `DECIMAL` é 65. O número máximo de casas decimais suportadas (*`D`*) é 30. Se *`D`* for omitido, o padrão é 0. Se *`M`* for omitido, o padrão é 10. (Existe também um limite para o quão longo pode ser o texto de literais `DECIMAL`; consulte a Seção 12.21.3, “Manipulação de Expressões”.)

  `UNSIGNED`, se especificado, não permite valores negativos.

  Todos os cálculos básicos (`+, -, *, /`) com colunas `DECIMAL` são feitos com uma precisão de 65 dígitos.

* [`DEC[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "11.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC"), [`NUMERIC[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "11.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC"), [`FIXED[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "11.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC")

  Estes tipos são sinônimos de `DECIMAL`. O sinônimo `FIXED` está disponível para compatibilidade com outros sistemas Database.

* `FLOAT[(M,D)] [UNSIGNED] [ZEROFILL]`

  Um número de ponto flutuante pequeno (single-precision). Os valores permitidos são `-3.402823466E+38` a `-1.175494351E-38`, `0` e `1.175494351E-38` a `3.402823466E+38`. Estes são os limites teóricos, baseados no padrão IEEE. O intervalo real pode ser ligeiramente menor dependendo do seu hardware ou sistema operacional.

  *`M`* é o número total de dígitos e *`D`* é o número de dígitos após o ponto decimal. Se *`M`* e *`D`* forem omitidos, os valores são armazenados até os limites permitidos pelo hardware. Um número de ponto flutuante single-precision tem precisão de aproximadamente 7 casas decimais.

  `FLOAT(M,D)` é uma extensão não padrão do MySQL.

  `UNSIGNED`, se especificado, não permite valores negativos.

  O uso de `FLOAT` pode gerar alguns problemas inesperados porque todos os cálculos no MySQL são feitos com precisão double. Consulte a Seção B.3.4.7, “Solucionando Problemas Sem Linhas Correspondentes”.

* `FLOAT(p) [UNSIGNED] [ZEROFILL]`

  Um número de ponto flutuante. *`p`* representa a precisão em bits, mas o MySQL usa este valor apenas para determinar se deve usar `FLOAT` ou `DOUBLE` para o tipo de dado resultante. Se *`p`* for de 0 a 24, o tipo de dado se torna `FLOAT` sem valores *`M`* ou *`D`*. Se *`p`* for de 25 a 53, o tipo de dado se torna `DOUBLE` sem valores *`M`* ou *`D`*. O intervalo da coluna resultante é o mesmo que para os tipos de dados `FLOAT` single-precision ou `DOUBLE` double-precision descritos anteriormente nesta seção.

  A sintaxe `FLOAT(p)` é fornecida para compatibilidade com ODBC.

* `DOUBLE[(M,D)] [UNSIGNED] [ZEROFILL]`

  Um número de ponto flutuante de tamanho normal (double-precision). Os valores permitidos são `-1.7976931348623157E+308` a `-2.2250738585072014E-308`, `0` e `2.2250738585072014E-308` a `1.7976931348623157E+308`. Estes são os limites teóricos, baseados no padrão IEEE. O intervalo real pode ser ligeiramente menor dependendo do seu hardware ou sistema operacional.

  *`M`* é o número total de dígitos e *`D`* é o número de dígitos após o ponto decimal. Se *`M`* e *`D`* forem omitidos, os valores são armazenados até os limites permitidos pelo hardware. Um número de ponto flutuante double-precision tem precisão de aproximadamente 15 casas decimais.

  `DOUBLE(M,D)` é uma extensão não padrão do MySQL.

  `UNSIGNED`, se especificado, não permite valores negativos.

* `DOUBLE PRECISION[(M,D)] [UNSIGNED] [ZEROFILL]`, `REAL[(M,D)] [UNSIGNED] [ZEROFILL]`

  Estes tipos são sinônimos de `DOUBLE`. Exceção: Se o modo SQL `REAL_AS_FLOAT` estiver habilitado, `REAL` é um sinônimo de `FLOAT` em vez de `DOUBLE`.