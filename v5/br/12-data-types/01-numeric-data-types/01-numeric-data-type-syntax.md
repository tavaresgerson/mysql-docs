### 11.1.1 Sintaxe do Tipo de Dados Numérico

Para os tipos de dados inteiros, *`M`* indica a largura mínima de exibição. A largura máxima de exibição é de 255. A largura de exibição não está relacionada ao intervalo de valores que um tipo pode armazenar, conforme descrito na Seção 11.1.6, “Atributos de tipos numéricos”.

Para os tipos de dados de ponto flutuante e ponto fixo, *`M`* é o número total de dígitos que podem ser armazenados.

Se você especificar `ZEROFILL` para uma coluna numérica, o MySQL adiciona automaticamente o atributo `UNSIGNED` à coluna.

Os tipos de dados numéricos que permitem o atributo `UNSIGNED` também permitem `SIGNED`. No entanto, esses tipos de dados são assinados por padrão, portanto, o atributo `SIGNED` não tem efeito.

`SERIAL` é um alias para `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

O `VALOR PREDEFINIDO SERIAL` na definição de uma coluna inteira é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Aviso

Quando você usa a subtração entre valores inteiros, onde um deles é do tipo `UNSIGNED`, o resultado é não assinado, a menos que o modo SQL `NO_UNSIGNED_SUBTRACTION` esteja habilitado. Veja a Seção 12.10, “Funções e Operadores de Cast”.

- `BIT[(M)]`

  Um tipo de valor de bit. *`M`* indica o número de bits por valor, de 1 a 64. O padrão é 1 se *`M`* for omitido.

- `TINYINT[(M)] [SEM CARACTERES EM NÚMERO] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um número inteiro muito pequeno. A faixa de sinalizado é de `-128` a `127`. A faixa de não sinalizado é de `0` a `255`.

- `BOOL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `BOOLEAN` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Esses tipos são sinônimos de `TINYINT(1)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Um valor de zero é considerado falso. Valores não nulos são considerados verdadeiros:

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

  No entanto, os valores `TRUE` e `FALSE` são apenas aliases para `1` e `0`, respectivamente, conforme mostrado aqui:

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

  As duas últimas declarações exibem os resultados mostrados porque `2` não é igual a `1` nem a `0`.

- `SMALLINT[(M)] [SEM SIGNIFICADO] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um pequeno inteiro. A faixa de valores assinados é de `-32768` a `32767`. A faixa de valores não assinados é de `0` a `65535`.

- `MEDIUMINT[(M)] [SEM SIGNIFICADO] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um inteiro de tamanho médio. O intervalo assinado é de `-8388608` a `8388607`. O intervalo não assinado é de `0` a `16777215`.

- `INT[(M)] [UNSIGNED] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um inteiro de tamanho normal. O intervalo assinado é de `-2147483648` a `2147483647`. O intervalo não assinado é de `0` a `4294967295`.

- `INTEGER[(M)] [UNSIGNED] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Este tipo é sinônimo de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

- `BIGINT[(M)] [SEM SIGNIFICADO] [ZEROFILL]` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  Um número inteiro grande. A faixa de valores assinados é de `-9223372036854775808` a `9223372036854775807`. A faixa de valores não assinados é de `0` a `18446744073709551615`.

  `SERIAL` é um alias para `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

  Algumas coisas que você deve saber sobre as colunas `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  - Todas as operações aritméticas são realizadas usando valores de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DOUBLE` - FLOAT, DOUBLE") assinados, portanto, você não deve usar inteiros grandes não assinados maiores que `9223372036854775807` (63 bits), exceto com funções de bits! Se você fizer isso, alguns dos últimos dígitos no resultado podem estar errados devido a erros de arredondamento ao converter um valor de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para um `DOUBLE` - FLOAT, DOUBLE").

    O MySQL pode lidar com `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") nos seguintes casos:

    - Ao usar inteiros para armazenar grandes valores não assinados em uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

    - Em `MIN(col_name)` ou `MAX(col_name)`, onde *`col_name`* se refere a uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

    - Quando usar operadores (`+`, `-`, `*`, etc.) onde ambos os operandos são inteiros.

  - Você sempre pode armazenar um valor inteiro exato em uma coluna \`BIGINT - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") armazenando-o usando uma string. Nesse caso, o MySQL realiza uma conversão de string para número que não envolve uma representação de dupla precisão intermediária.

  - Os operadores `-`, `+` e `*` usam aritmética `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") quando ambos os operandos são valores inteiros. Isso significa que, se você multiplicar dois grandes inteiros (ou resultados de funções que retornam inteiros), você pode obter resultados inesperados quando o resultado for maior que `9223372036854775807`.

- [`DECIMAL[(M[, D])] [UNSIGNED] [ZEROFILL]`](tipos-de-ponto-fixo.html)

  Um número fixo "exato" preenchido. *`M`* é o número total de dígitos (a precisão) e *`D`* é o número de dígitos após o ponto decimal (a escala). O ponto decimal e (para números negativos) o sinal `-` não são contados em *`M`*. Se *`D`* for 0, os valores não têm ponto decimal ou parte fracionária. O número máximo de dígitos (*`M`*) para `DECIMAL` - DECIMAL, NUMERIC") é 65. O número máximo de casas decimais suportadas (*`D`*) é 30. Se *`D`* for omitido, o padrão é 0. Se *`M`* for omitido, o padrão é 10. (Há também um limite para a quantidade de texto que os literais `DECIMAL` - DECIMAL, NUMERIC") podem ter; veja a Seção 12.21.3, “Tratamento de Expressões.”)

  `UNSIGNED`, se especificado, impede valores negativos.

  Todos os cálculos básicos (`+, -, *, /`) com as colunas `DECIMAL` - `DECIMAL`, `NUMERIC`) são feitos com precisão de 65 dígitos.

- [`DEC[(M[,D])] [DESIGUAL À ZERO]`](fixed-point-types.html), [`NUMERIC[(M[,D])] [DESIGUAL À ZERO]`](fixed-point-types.html), [`FIXED[(M[,D])] [DESIGUAL À ZERO]`](fixed-point-types.html)

  Esses tipos são sinônimos de `DECIMAL` - DECIMAL, NUMERIC"). O sinônimo `FIXED` - DECIMAL, NUMERIC") está disponível para compatibilidade com outros sistemas de banco de dados.

- `FLOAT[(M,D)] [UNSIGNED] [ZEROFILL]` - FLOAT, DOUBLE")

  Um número de ponto flutuante pequeno (de precisão simples). Os valores permitidos são `-3,402823466E+38` a `-1,175494351E-38`, `0` e `1,175494351E-38` a `3,402823466E+38`. Estes são os limites teóricos, com base no padrão IEEE. A faixa real pode ser ligeiramente menor, dependendo do seu hardware ou sistema operacional.

  *`M`* é o número total de dígitos e *`D`* é o número de dígitos após a vírgula. Se *`M`* e *`D`* forem omitidos, os valores serão armazenados nos limites permitidos pelo hardware. Um número de ponto flutuante de precisão simples tem precisão de aproximadamente 7 casas decimais.

  `FLOAT(M,D)` é uma extensão não padrão do MySQL.

  `UNSIGNED`, se especificado, impede valores negativos.

  Usar `FLOAT` - FLOAT, DOUBLE") pode causar alguns problemas inesperados, pois todos os cálculos no MySQL são feitos com precisão dupla. Veja a Seção B.3.4.7, “Resolvendo Problemas com Nenhuma Linha Correspondente”.

- `FLOAT(p) [UNSIGNED] [ZEROFILL]` - FLOAT, DOUBLE")

  Um número de ponto flutuante. *`p`* representa a precisão em bits, mas o MySQL usa esse valor apenas para determinar se deve usar `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") para o tipo de dado resultante. Se *`p`* estiver entre 0 e 24, o tipo de dado se torna `FLOAT` - FLOAT, DOUBLE") sem valores de *`M`* ou *`D`*. Se *`p`* estiver entre 25 e 53, o tipo de dado se torna `DOUBLE` - FLOAT, DOUBLE") sem valores de *`M`* ou *`D`*. A faixa da coluna resultante é a mesma que para os tipos de dados `FLOAT` - FLOAT, DOUBLE") de precisão simples ou `DOUBLE` - FLOAT, DOUBLE") de precisão dupla descritos anteriormente nesta seção.

  A sintaxe `FLOAT(p)` - FLOAT, DOUBLE") é fornecida para compatibilidade com ODBC.

- `DOUBLE[(M, D)] [UNSIGNED] [ZEROFILL]` - FLOAT, DOUBLE")

  Um número de ponto flutuante de tamanho normal (dupla precisão). Os valores permitidos são `-1.7976931348623157E+308` a `-2.2250738585072014E-308`, `0` e `2.2250738585072014E-308` a `1.7976931348623157E+308`. Estes são os limites teóricos, com base no padrão IEEE. A faixa real pode ser ligeiramente menor, dependendo do seu hardware ou sistema operacional.

  *`M`* é o número total de dígitos e *`D`* é o número de dígitos após a vírgula. Se *`M`* e *`D`* forem omitidos, os valores serão armazenados nos limites permitidos pelo hardware. Um número de ponto flutuante de dupla precisão tem precisão de aproximadamente 15 casas decimais.

  `DOUBLE(M, D)` é uma extensão não padrão do MySQL.

  `UNSIGNED`, se especificado, impede valores negativos.

- `DOUBLE PRECISION[(M,D)] [DESIGUALADO] [ZEROFILL]` - FLOAT, DOUBLE"), `REAL[(M,D)] [DESIGUALADO] [ZEROFILL]` - FLOAT, DOUBLE")

  Esses tipos são sinônimos de `DOUBLE` - FLOAT, DOUBLE"). Exceção: Se o modo SQL `REAL_AS_FLOAT` estiver habilitado, `REAL` - FLOAT, DOUBLE") é um sinônimo de `FLOAT` - FLOAT, DOUBLE") em vez de `DOUBLE` - FLOAT, DOUBLE").
