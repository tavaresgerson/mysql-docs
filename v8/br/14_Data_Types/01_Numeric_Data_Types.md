## 13.1 Tipos de dados numéricos

MySQL suporta todos os tipos de dados numéricos padrão do SQL. Esses tipos incluem os tipos de dados numéricos exatos (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `DECIMAL` - DECIMAL, NUMERIC"), e `NUMERIC` - DECIMAL, NUMERIC")), bem como os tipos de dados numéricos aproximados (`FLOAT` - FLOAT, DOUBLE"), `REAL` - FLOAT, DOUBLE"), e `DOUBLE PRECISION` - FLOAT, DOUBLE"). A palavra-chave `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") é sinônimo de `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e as palavras-chave `DEC` - DECIMAL, NUMERIC") e `FIXED` - DECIMAL, NUMERIC") são sinônimos de `DECIMAL` - DECIMAL, NUMERIC"). O MySQL trata `DOUBLE` - FLOAT, DOUBLE") como sinônimo de `DOUBLE PRECISION` - FLOAT, DOUBLE") (uma extensão não padrão). O MySQL também trata `REAL` - FLOAT, DOUBLE") como sinônimo de `DOUBLE PRECISION` - FLOAT, DOUBLE") (uma variação não padrão), a menos que o modo SQL `REAL_AS_FLOAT` seja habilitado.

O tipo de dados `BIT` armazena valores de bits e é suportado para as tabelas `MyISAM`, `MEMORY`, `InnoDB` e `NDB`.

Para obter informações sobre como o MySQL lida com a atribuição de valores fora do intervalo a colunas e o excesso durante a avaliação de expressões, consulte a Seção 13.1.7, “Tratamento de valores fora do intervalo e excesso”.

Para informações sobre os requisitos de armazenamento dos tipos de dados numéricos, consulte a Seção 13.7, “Requisitos de Armazenamento do Tipo de Dados”.

Para descrições de funções que operam em valores numéricos, consulte a Seção 14.6, “Funções e Operadores Numéricos”. O tipo de dados utilizado para o resultado de um cálculo em operandos numéricos depende dos tipos dos operandos e das operações realizadas sobre eles. Para mais informações, consulte a Seção 14.6.1, “Operadores Aritméticos”.

### 13.1.1 Sintaxe do tipo de dados numérico

Para os tipos de dados inteiros, *`M`* indica a largura mínima de exibição. A largura máxima de exibição é de 255. A largura de exibição não está relacionada ao intervalo de valores que um tipo pode armazenar, conforme descrito na Seção 13.1.6, “Atributos do tipo numérico”.

Para os tipos de dados de ponto flutuante e fixo, *`M`* é o número total de dígitos que podem ser armazenados.

A partir do MySQL 8.0.17, o atributo width de exibição é descontinuado para tipos de dados inteiros; você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL.

Se você especificar `ZEROFILL` para uma coluna numérica, o MySQL adiciona automaticamente o atributo `UNSIGNED` à coluna.

A partir do MySQL 8.0.17, o atributo `ZEROFILL` é desatualizado para tipos de dados numéricos; você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL. Considere usar um meio alternativo para produzir o efeito deste atributo. Por exemplo, as aplicações podem usar a função `LPAD()` para zero-pad números até o tamanho desejado, ou elas podem armazenar os números formatados nas colunas `CHAR`.

Os tipos de dados numéricos que permitem o atributo `UNSIGNED` também permitem `SIGNED`. No entanto, esses tipos de dados são assinados por padrão, portanto, o atributo `SIGNED` não tem efeito.

A partir do MySQL 8.0.17, o atributo `UNSIGNED` é descontinuado para colunas do tipo `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), e `DECIMAL` - DECIMAL, NUMERIC") (e quaisquer sinônimos); você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

`SERIAL` é um alias para `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

`SERIAL DEFAULT VALUE` na definição de uma coluna inteira é um alias para `NOT NULL AUTO_INCREMENT UNIQUE`.

Aviso

Quando você usa subtração entre valores inteiros, onde um é do tipo `UNSIGNED`, o resultado é não assinado, a menos que o modo SQL `NO_UNSIGNED_SUBTRACTION` esteja habilitado. Veja a Seção 14.10, “Funções e Operadores de Cast”.

* `BIT[(M)]`

Um tipo de valor de bit. *`M`* indica o número de bits por valor, de 1 a 64. O padrão é 1 se *`M`* é omitido.

* `TINYINT[(M)] [UNSIGNED] [ZEROFILL]`(integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)

Um número inteiro muito pequeno. A faixa assinada é `-128` a `127`. A faixa não assinada é `0` a `255`.

* `BOOL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `BOOLEAN` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

Esses tipos são sinônimos de `TINYINT(1)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT). Um valor de zero é considerado falso. Valores não nulos são considerados verdadeiros:

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

No entanto, os valores `TRUE` e `FALSE` são apenas aliases para `1`, respectivamente, conforme mostrado aqui:

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

As duas últimas declarações exibem os resultados mostrados porque `2` não é igual a nem `1` nem `0`.

* `SMALLINT[(M)] [UNSIGNED] [ZEROFILL]`(integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)

Um pequeno número inteiro. A faixa assinada é `-32768` a `32767`. A faixa não assinada é `0` a `65535`.

* `MEDIUMINT[(M)] [UNSIGNED] [ZEROFILL]`(integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)

Um número inteiro de tamanho médio. O intervalo assinado é `-8388608` a `8388607`. O intervalo não assinado é `0` a `16777215`.

* `INT[(M)] [UNSIGNED] [ZEROFILL]`(integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)

Um número inteiro de tamanho normal. O intervalo assinado é `-2147483648` a `2147483647`. O intervalo não assinado é `0` a `4294967295`.

* `INTEGER[(M)] [UNSIGNED] [ZEROFILL]`(integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)

Este tipo é sinônimo de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

* `BIGINT[(M)] [UNSIGNED] [ZEROFILL]`(integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)

Um número inteiro grande. A faixa assinada é `-9223372036854775808` a `9223372036854775807`. A faixa não assinada é `0` a `18446744073709551615`.

`SERIAL` é um alias para `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

Algumas coisas que você deve estar ciente em relação às colunas `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) são:

Todos os cálculos aritméticos são realizados usando valores de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DOUBLE` - FLOAT, DOUBLE") assinados, portanto, você não deve usar números inteiros grandes não assinados maiores que `9223372036854775807` (63 bits), exceto com funções de bits! Se você fizer isso, algumas das últimas dígitos no resultado podem estar erradas devido a erros de arredondamento ao converter um valor de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para um `DOUBLE` - FLOAT, DOUBLE").

O MySQL pode lidar com `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) nos seguintes casos:

- Ao usar inteiros para armazenar grandes valores não assinados em uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

- Em `MIN(col_name)` ou `MAX(col_name)`, onde *`col_name`* se refere a uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

- Ao usar operadores (`+`, `-`, `*`, e assim por diante) onde ambos os operandos são inteiros.

+ Você sempre pode armazenar um valor inteiro exato em uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") armazenando-o usando uma string. Nesse caso, o MySQL realiza uma conversão de string para número que não envolve uma representação intermediária de dupla precisão.

Os operadores `-`, `+` e `*` utilizam aritmética `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) quando ambos os operandos são valores inteiros. Isso significa que, se você multiplicar dois grandes inteiros (ou resultados de funções que retornam inteiros), você pode obter resultados inesperados quando o resultado for maior que `9223372036854775807`.

* `DECIMAL[(M[,D])] [UNSIGNED] [ZEROFILL]`(fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC")

Um número fixo "exato" com um número de dígitos *`M`* é o número total de dígitos (a precisão) e *`D`* é o número de dígitos após o ponto decimal (a escala). O ponto decimal e (para números negativos) o sinal *`-`* não são contados em *`M`*. Se *`D`* é 0, os valores não têm ponto decimal ou parte fracionária. O número máximo de dígitos *`M`* para *`DECIMAL` - DECIMAL, NUMERIC") é 65. O número máximo de decimais suportados *`D`* é 30. Se *`D`* é omitido, o padrão é 0. Se *`M`* é omitido, o padrão é 10. (Há também um limite sobre o comprimento do texto de *`DECIMAL` - DECIMAL, NUMERIC") literais; veja Seção 14.24.3, “Tratamento de Expressões.”)

`UNSIGNED`, se especificado, não permite valores negativos. A partir do MySQL 8.0.17, o atributo `UNSIGNED` é desaconselhado para colunas do tipo `DECIMAL` - DECIMAL, NUMERIC") (e quaisquer sinônimos); você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

Todos os cálculos básicos (`+, -, *, /`) com as colunas `DECIMAL` - DECIMAL, NUMERIC") são feitos com precisão de 65 dígitos.

* `DEC[(M[,D])] [UNSIGNED] [ZEROFILL]`(fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), `NUMERIC[(M[,D])] [UNSIGNED] [ZEROFILL]`(fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), `FIXED[(M[,D])] [UNSIGNED] [ZEROFILL]`(fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC")

Esses tipos são sinônimos de `DECIMAL` - DECIMAL, NUMERIC"). O sinônimo `FIXED` - DECIMAL, NUMERIC") está disponível para compatibilidade com outros sistemas de banco de dados.

* `FLOAT[(M,D)] [UNSIGNED] [ZEROFILL]`(floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

Um número pequeno (de precisão simples) de ponto flutuante. Os valores permitidos são `-3.402823466E+38` a `-1.175494351E-38`, `0` e `1.175494351E-38` a `3.402823466E+38`. Estes são os limites teóricos, com base no padrão IEEE. A faixa real pode ser ligeiramente menor, dependendo do seu hardware ou sistema operacional.

*`M`* é o número total de dígitos e *`D`* é o número de dígitos após o ponto decimal. Se *`M`* e *`D`* forem omitidos, os valores são armazenados nos limites permitidos pelo hardware. Um número de ponto flutuante de uma única precisão é preciso aproximadamente a 7 casas decimais.

`FLOAT(M,D)` é uma extensão MySQL não padrão. A partir do MySQL 8.0.17, essa sintaxe é desatualizada e você deve esperar que o suporte a ela seja removido em uma versão futura do MySQL.

`UNSIGNED`, se especificado, não permite valores negativos. A partir do MySQL 8.0.17, o atributo `UNSIGNED` é desaconselhado para colunas do tipo `FLOAT` - FLOAT, DOUBLE") (e quaisquer sinônimos) e você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

Usar `FLOAT` - FLOAT, DOUBLE") pode lhe causar alguns problemas inesperados, pois todos os cálculos no MySQL são feitos com precisão dupla. Veja a Seção B.3.4.7, "Resolvendo problemas com nenhuma linha correspondente".

* `FLOAT(p) [UNSIGNED] [ZEROFILL]`(floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

Um número de ponto flutuante. *`p`* representa a precisão em bits, mas o MySQL usa esse valor apenas para determinar se deve usar `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") para o tipo de dados resultante. Se *`p`* estiver de 0 a 24, o tipo de dados se torna `FLOAT` - FLOAT, DOUBLE") sem valores de *`M`* ou *`D`*. Se *`p`* estiver de 25 a 53, o tipo de dados se torna `DOUBLE` - FLOAT, DOUBLE") sem valores de *`M`* ou *`D`*. A faixa da coluna resultante é a mesma que para os tipos de dados de precisão única `FLOAT` - FLOAT, DOUBLE") ou de precisão dupla `DOUBLE` - FLOAT, DOUBLE") descritos anteriormente nesta seção.

`UNSIGNED`, se especificado, não permite valores negativos. A partir do MySQL 8.0.17, o atributo `UNSIGNED` é desaconselhado para colunas do tipo `FLOAT` - FLOAT, DOUBLE") (e quaisquer sinônimos) e você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

`FLOAT(p)` - A sintaxe de FLOAT, DOUBLE") é fornecida para compatibilidade com ODBC.

* `DOUBLE[(M,D)] [UNSIGNED] [ZEROFILL]`(floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

Um número de ponto flutuante de tamanho normal (de ponto dupla). Os valores permitidos são `-1.7976931348623157E+308` a `-2.2250738585072014E-308`, `0` e `2.2250738585072014E-308` a `1.7976931348623157E+308`. Esses são os limites teóricos, com base no padrão IEEE. A faixa real pode ser ligeiramente menor, dependendo do seu hardware ou sistema operacional.

*`M`* é o número total de dígitos e *`D`* é o número de dígitos após o ponto decimal. Se *`M`* e *`D`* forem omitidos, os valores são armazenados nos limites permitidos pelo hardware. Um número de ponto flutuante de dupla precisão é preciso aproximadamente a 15 casas decimais.

`DOUBLE(M,D)` é uma extensão MySQL não padrão. A partir do MySQL 8.0.17, essa sintaxe é desatualizada e você deve esperar que o suporte a ela seja removido em uma versão futura do MySQL.

`UNSIGNED`, se especificado, não permite valores negativos. A partir do MySQL 8.0.17, o atributo `UNSIGNED` é descontinuado para colunas do tipo `DOUBLE` - FLOAT, DOUBLE") (e quaisquer sinônimos) e você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

* `DOUBLE PRECISION[(M,D)] [UNSIGNED] [ZEROFILL]`(floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"), `REAL[(M,D)] [UNSIGNED] [ZEROFILL]`(floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

Esses tipos são sinônimos de `DOUBLE` - FLOAT, DOUBLE"). Exceção: Se o modo SQL `REAL_AS_FLOAT` estiver habilitado, `REAL` - FLOAT, DOUBLE") é sinônimo de `FLOAT` - FLOAT, DOUBLE") em vez de `DOUBLE` - FLOAT, DOUBLE").

### 13.1.2 Tipos de número inteiro (valor exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

O MySQL suporta os tipos inteiros padrão do SQL `INTEGER` (ou `INT`) e `SMALLINT`. Como uma extensão do padrão, o MySQL também suporta os tipos inteiros `TINYINT`, `MEDIUMINT` e `BIGINT`. O quadro a seguir mostra o armazenamento e a faixa necessárias para cada tipo de inteiro.

**Tabela 13.1 Armazenamento e alcance necessários para os tipos inteiros suportados pelo MySQL**

<table summary="Required storage and range for integer types supported by MySQL. Information includes the integer type, the storage size in bytes, the minimum signed and unsigned values, and the maximum signed and unsigned values."><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><thead><tr> <th scope="col">Tipo</th> <th scope="col">Armazenamento (Bytes)</th> <th scope="col">Valor mínimo assinado</th> <th scope="col">Valor mínimo não assinado</th> <th scope="col">Valor máximo assinado</th> <th scope="col">Valor máximo não assinado</th> </tr></thead><tbody><tr> <th scope="row"><code>TINYINT</code></th> <td>1</td> <td><code>-128</code></td> <td><code>0</code></td> <td><code>127</code></td> <td><code>255</code></td> </tr><tr> <th scope="row"><code>SMALLINT</code></th> <td>2</td> <td><code>-32768</code></td> <td><code>0</code></td> <td><code>32767</code></td> <td><code>65535</code></td> </tr><tr> <th scope="row"><code>MEDIUMINT</code></th> <td>3</td> <td><code>-8388608</code></td> <td><code>0</code></td> <td><code>8388607</code></td> <td><code>16777215</code></td> </tr><tr> <th scope="row"><code>INT</code></th> <td>4</td> <td><code>-2147483648</code></td> <td><code>0</code></td> <td><code>2147483647</code></td> <td><code>4294967295</code></td> </tr><tr> <th scope="row"><code>BIGINT</code></th> <td>8</td> <td><code>-2<sup>63</sup></code></td> <td><code>0</code></td> <td><code>2<sup>63</sup>-1</code></td> <td><code>2<sup>64</sup>-1</code></td> </tr></tbody></table>

### 13.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC

Os tipos `DECIMAL` e `NUMERIC` armazenam valores de dados numéricos exatos. Estes tipos são utilizados quando é importante preservar precisão exata, por exemplo, com dados monetários. Em MySQL, `NUMERIC` é implementado como `DECIMAL`, portanto, as seguintes observações sobre `DECIMAL` se aplicam igualmente a `NUMERIC`.

MySQL armazena os valores `DECIMAL` no formato binário. Veja a Seção 14.24, “Matemática de Precisão”.

Em uma declaração de coluna `DECIMAL`, a precisão e a escala podem ser (e geralmente são) especificadas. Por exemplo:

```
salary DECIMAL(5,2)
```

Neste exemplo, `5` é a precisão e `2` é a escala. A precisão representa o número de dígitos significativos que são armazenados para os valores, e a escala representa o número de dígitos que podem ser armazenados após o ponto decimal.

O SQL padrão exige que `DECIMAL(5,2)` seja capaz de armazenar qualquer valor com cinco dígitos e dois decimais, portanto, os valores que podem ser armazenados na faixa da coluna `salary` variam de `-999.99` a `999.99`.

No SQL padrão, a sintaxe `DECIMAL(M)` é equivalente a `DECIMAL(M,0)`. Da mesma forma, a sintaxe `DECIMAL` é equivalente a `DECIMAL(M,0)`, onde a implementação é permitida para decidir o valor de *`M`*. O MySQL suporta ambas as formas variantes da sintaxe `DECIMAL`. O valor padrão de *`M`* é 10.

Se a escala for 0, os valores de `DECIMAL` não contêm ponto decimal ou parte fracionária.

O número máximo de dígitos para `DECIMAL` é 65, mas a faixa real para uma coluna específica `DECIMAL` pode ser limitada pela precisão ou escala para uma coluna específica. Quando uma coluna é atribuída um valor com mais dígitos após o ponto decimal do que o permitido pela escala especificada, o valor é convertido para essa escala. (O comportamento preciso é específico do sistema operacional, mas, geralmente, o efeito é a troncamento para o número permitido de dígitos.)

### 13.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE

Os tipos `FLOAT` e `DOUBLE` representam valores aproximados de dados numéricos. O MySQL utiliza quatro bytes para valores de precisão simples e oito bytes para valores de precisão dupla.

Para `FLOAT`, o padrão SQL permite uma especificação opcional da precisão (mas não da faixa do expoente) em bits após a palavra-chave `FLOAT` entre parênteses, ou seja, `FLOAT(p)` - FLOAT, DOUBLE"). O MySQL também suporta essa especificação opcional de precisão, mas o valor de precisão em `FLOAT(p)` - FLOAT, DOUBLE") é usado apenas para determinar o tamanho de armazenamento. Uma precisão de 0 a 23 resulta em uma coluna de precisão única de 4 bytes `FLOAT`. Uma precisão de 24 a 53 resulta em uma coluna de precisão dupla de 8 bytes `DOUBLE`.

O MySQL permite uma sintaxe não padrão: `FLOAT(M,D)` ou `REAL(M,D)` ou `DOUBLE PRECISION(M,D)`. Aqui, `(M,D)` significa que os valores podem ser armazenados com até *`M`* dígitos no total, dos quais *`D`* dígitos podem ser após o ponto decimal. Por exemplo, uma coluna definida como `FLOAT(7,4)` é exibida como `-999.9999`. O MySQL realiza arredondamento ao armazenar valores, então se você inserir `999.00009` em uma coluna `FLOAT(7,4)`, o resultado aproximado é `999.0001`.

A partir do MySQL 8.0.17, a sintaxe não padrão `FLOAT(M,D)` e `DOUBLE(M,D)` é descontinuada e você deve esperar que o suporte para ela seja removido em uma versão futura do MySQL.

Como os valores de ponto flutuante são aproximados e não são armazenados como valores exatos, as tentativas de tratá-los como exatos em comparações podem levar a problemas. Eles também estão sujeitos a dependências de plataforma ou implementação. Para mais informações, consulte a Seção B.3.4.8, “Problemas com Valores de Ponto Flutuante”.

Para máxima portabilidade, o código que exige o armazenamento de valores de dados numéricos aproximados deve usar `FLOAT` ou `DOUBLE PRECISION` sem especificar precisão ou número de dígitos.

### 13.1.5 Tipo de Valor de Bit - BIT

O tipo de dados `BIT` é usado para armazenar valores de bit. Um tipo de `BIT(M)` permite o armazenamento de valores de *`M`*-bit. *`M`* pode variar de 1 a 64.

Para especificar valores de bits, a notação `b'value'` pode ser usada. *`value`* é um valor binário escrito usando zeros e uns. Por exemplo, `b'111'` e `b'10000000'` representam, respectivamente, 7 e 128. Veja a Seção 11.1.5, “Literais de Valor de Bits”.

Se você atribuir um valor a uma coluna `BIT(M)` que tenha menos de *`M`* bits de comprimento, o valor é preenchido à esquerda com zeros. Por exemplo, atribuir um valor de `b'101'` a uma coluna `BIT(6)` é, na verdade, o mesmo que atribuir `b'000101'`.

**Grupo NDB.** O tamanho combinado máximo de todas as colunas `BIT` utilizadas em uma tabela `NDB` dada não deve exceder 4096 bits.

### 13.1.6 Atributos do tipo numérico

O MySQL suporta uma extensão para especificar opcionalmente a largura de exibição dos tipos de dados inteiros entre parênteses após a palavra-chave base para o tipo. Por exemplo, `INT(4)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") especifica um `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") com uma largura de exibição de quatro dígitos. Essa largura de exibição opcional pode ser usada por aplicativos para exibir valores inteiros com uma largura menor que a largura especificada para a coluna, preenchendo-os com espaços. (Ou seja, essa largura está presente nos metadados retornados com os conjuntos de resultados. Se ela é usada depende do aplicativo.)

A largura do display *não* limita a faixa de valores que podem ser armazenados na coluna. Ela também não impede que valores mais largos que a largura do display da coluna sejam exibidos corretamente. Por exemplo, uma coluna especificada como `SMALLINT(3)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") tem a faixa usual `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de `-32768` a `32767`, e os valores fora da faixa permitida por três dígitos são exibidos na íntegra usando mais de três dígitos.

Quando usado em conjunto com o atributo opcional (não padronizado) `ZEROFILL`, o preenchimento padrão de espaços é substituído por zeros. Por exemplo, para uma coluna declarada como `INT(4) ZEROFILL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), um valor de `5` é recuperado como `0005`.

Nota

O atributo `ZEROFILL` é ignorado para as colunas envolvidas em expressões ou consultas `UNION`.

Se você armazenar valores maiores que a largura de exibição em uma coluna inteira que tem o atributo `ZEROFILL`, você pode enfrentar problemas quando o MySQL gera tabelas temporárias para algumas junções complicadas. Nesses casos, o MySQL assume que os valores dos dados cabem dentro da largura de exibição da coluna.

A partir do MySQL 8.0.17, o atributo `ZEROFILL` é descontinuado para tipos de dados numéricos, assim como o atributo de largura de exibição para tipos de dados inteiros. Você deve esperar que o suporte para `ZEROFILL` e as larguras de exibição para tipos de dados inteiros seja removido em uma versão futura do MySQL. Considere usar um meio alternativo para produzir o efeito desses atributos. Por exemplo, as aplicações podem usar a função `LPAD()` para zero-pad números até a largura desejada, ou podem armazenar os números formatados nas colunas `CHAR`.

Todos os tipos inteiros podem ter um atributo opcional (não padronizado) `UNSIGNED`. Um tipo não assinado pode ser usado para permitir apenas números não negativos em uma coluna ou quando você precisa de um intervalo numérico maior para a coluna. Por exemplo, se uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") é `UNSIGNED`, o tamanho do intervalo da coluna é o mesmo, mas seus pontos finais se deslocam para cima, de `-2147483648` e `2147483647` para `0` e `4294967295`.

Os tipos de ponto flutuante e ponto fixo também podem ser `UNSIGNED`. Assim como os tipos de inteiro, este atributo impede que valores negativos sejam armazenados na coluna. Ao contrário dos tipos de inteiro, o intervalo superior dos valores da coluna permanece o mesmo. A partir do MySQL 8.0.17, o atributo `UNSIGNED` é desatualizado para colunas do tipo `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), e `DECIMAL` - DECIMAL, NUMERIC") (e quaisquer sinônimos) e você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

Se você especificar `ZEROFILL` para uma coluna numérica, o MySQL adiciona automaticamente o atributo `UNSIGNED`.

Os tipos de dados inteiros ou de ponto flutuante podem ter o atributo `AUTO_INCREMENT`. Quando você insere um valor de `NULL` em uma coluna indexada `AUTO_INCREMENT`, a coluna é definida para o próximo valor da sequência. Tipicamente, isso é `value+1`, onde *`value`* é o maior valor para a coluna atualmente na tabela. (As sequências `AUTO_INCREMENT` começam com `1`.)

Armazenar `0` em uma coluna `AUTO_INCREMENT` tem o mesmo efeito que armazenar `NULL`, a menos que o modo SQL `NO_AUTO_VALUE_ON_ZERO` esteja habilitado.

Para inserir `NULL` e gerar valores de `AUTO_INCREMENT`, é necessário que a coluna seja declarada `NOT NULL`. Se a coluna for declarada `NULL`, inserir `NULL` armazena um `NULL`. Quando você insere qualquer outro valor em uma coluna `AUTO_INCREMENT`, a coluna é definida para esse valor e a sequência é redefinida para que o próximo valor automaticamente gerado siga sequencialmente a partir do valor inserido.

Os valores negativos para as colunas `AUTO_INCREMENT` não são suportados.

As restrições `CHECK` não podem se referir a colunas que possuem o atributo `AUTO_INCREMENT`, e também não é possível adicionar o atributo `AUTO_INCREMENT` a colunas existentes que são utilizadas em restrições `CHECK`.

A partir do MySQL 8.0.17, o suporte ao `AUTO_INCREMENT` é descontinuado para as colunas `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") e você deve esperar que ele seja removido em uma versão futura do MySQL. Considere remover o atributo `AUTO_INCREMENT` dessas colunas ou convertê-las em um tipo de número inteiro.

### 13.1.7 Tratamento de Saídas Fora do Alcance e de Excesso

Quando o MySQL armazena um valor em uma coluna numérica que está fora do intervalo permitido do tipo de dados da coluna, o resultado depende do modo SQL em vigor naquela época:

* Se o modo SQL rigoroso estiver habilitado, o MySQL rejeita o valor fora do intervalo com um erro e a inserção falha, de acordo com o padrão SQL.

* Se nenhum modo restritivo estiver habilitado, o MySQL corta o valor ao ponto final apropriado do intervalo do tipo de dados da coluna e armazena o valor resultante.

Quando um valor fora do intervalo é atribuído a uma coluna inteira, o MySQL armazena o valor que representa o ponto final correspondente ao intervalo do tipo de dados da coluna.

Quando uma coluna de ponto flutuante ou ponto fixo é atribuída um valor que excede o intervalo implícito pela precisão e escala especificados (ou padrão), o MySQL armazena o valor que representa o ponto final correspondente a esse intervalo.

Suponha que uma tabela `t1` tenha esta definição:

```
CREATE TABLE t1 (i1 TINYINT, i2 TINYINT UNSIGNED);
```

Com o modo SQL rigoroso ativado, ocorre um erro fora do intervalo:

```
mysql> SET sql_mode = 'TRADITIONAL';
mysql> INSERT INTO t1 (i1, i2) VALUES(256, 256);
ERROR 1264 (22003): Out of range value for column 'i1' at row 1
mysql> SELECT * FROM t1;
Empty set (0.00 sec)
```

Com o modo SQL rigoroso não ativado, o recorte com avisos ocorre:

```
mysql> SET sql_mode = '';
mysql> INSERT INTO t1 (i1, i2) VALUES(256, 256);
mysql> SHOW WARNINGS;
+---------+------+---------------------------------------------+
| Level   | Code | Message                                     |
+---------+------+---------------------------------------------+
| Warning | 1264 | Out of range value for column 'i1' at row 1 |
| Warning | 1264 | Out of range value for column 'i2' at row 1 |
+---------+------+---------------------------------------------+
mysql> SELECT * FROM t1;
+------+------+
| i1   | i2   |
+------+------+
|  127 |  255 |
+------+------+
```

Quando o modo SQL rigoroso não está habilitado, as conversões de atribuição de colunas que ocorrem devido ao recorte são relatadas como avisos para as declarações `ALTER TABLE`, `LOAD DATA`, `UPDATE` e `INSERT` de várias linhas. No modo rigoroso, essas declarações falham e alguns ou todos os valores não são inseridos ou alterados, dependendo se a tabela é uma tabela transacional e outros fatores. Para obter detalhes, consulte a Seção 7.1.11, “Modos SQL do servidor”.

O excesso durante a avaliação de expressões numéricas resulta em um erro. Por exemplo, o maior valor assinado `BIGINT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) é 9223372036854775807, então a expressão a seguir produz um erro:

```
mysql> SELECT 9223372036854775807 + 1;
ERROR 1690 (22003): BIGINT value is out of range in '(9223372036854775807 + 1)'
```

Para permitir que a operação tenha sucesso neste caso, converta o valor para não assinado;

```
mysql> SELECT CAST(9223372036854775807 AS UNSIGNED) + 1;
+-------------------------------------------+
| CAST(9223372036854775807 AS UNSIGNED) + 1 |
+-------------------------------------------+
|                       9223372036854775808 |
+-------------------------------------------+
```

Se ocorrer overflow, isso depende da faixa dos operandos, então outra maneira de lidar com a expressão anterior é usar aritmética de valor exato porque os valores de `DECIMAL` - DECIMAL, NUMERIC") têm uma faixa maior do que os inteiros:

```
mysql> SELECT 9223372036854775807.0 + 1;
+---------------------------+
| 9223372036854775807.0 + 1 |
+---------------------------+
|     9223372036854775808.0 |
+---------------------------+
```

A subtração entre valores inteiros, onde um é do tipo `UNSIGNED`, produz um resultado não assinado por padrão. Se o resultado, de outra forma, tivesse sido negativo, resulta em um erro:

```
mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT CAST(0 AS UNSIGNED) - 1;
ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
```

Se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado será negativo:

```
mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
mysql> SELECT CAST(0 AS UNSIGNED) - 1;
+-------------------------+
| CAST(0 AS UNSIGNED) - 1 |
+-------------------------+
|                      -1 |
+-------------------------+
```

Se o resultado de uma operação desse tipo for usado para atualizar uma coluna inteira `UNSIGNED`, o resultado é limitado ao valor máximo para o tipo da coluna, ou limitado a 0 se `NO_UNSIGNED_SUBTRACTION` estiver habilitado. Se o modo SQL rigoroso estiver habilitado, ocorre um erro e a coluna permanece inalterada.