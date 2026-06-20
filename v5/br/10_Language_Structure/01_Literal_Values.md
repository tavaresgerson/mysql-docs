## 9.1 Valores Literais

Esta seção descreve como escrever valores literais no MySQL. Isso inclui strings, números, valores hexadecimais e de bits, valores booleanos e `NULL`. A seção também abrange várias nuances que você pode encontrar ao lidar com esses tipos básicos no MySQL.

### 9.1.1 Literais de String

Uma cadeia é uma sequência de bytes ou caracteres, encerrada entre aspas simples (`'`) ou aspas duplas (`"`). Exemplos:

```sql
'a string'
"another string"
```

As strings citadas colocadas uma ao lado da outra são concatenadas em uma única string. As strings seguintes são equivalentes:

```sql
'a string'
'a' ' ' 'string'
```

Se o modo SQL `ANSI_QUOTES` estiver habilitado, as letras de cadeia podem ser citadas apenas entre aspas simples, porque uma letra de cadeia citada entre aspas duplas é interpretada como um identificador.

Uma string binária é uma string de bytes. Cada string binária tem um conjunto de caracteres e uma ordenação nomeados `binary`. Uma string não binária é uma string de caracteres. Ela tem um conjunto de caracteres diferente de `binary` e uma ordenação que é compatível com o conjunto de caracteres.

Para ambos os tipos de strings, as comparações são baseadas nos valores numéricos da unidade de string. Para strings binárias, a unidade é o byte; as comparações utilizam valores numéricos de byte. Para strings não binárias, a unidade é o caractere e alguns conjuntos de caracteres suportam caracteres multibyte; as comparações utilizam valores de código de caracteres numéricos. A ordenação do código de caracteres é uma função da correção de string. (Para mais informações, consulte a Seção 10.8.5, “A Coligação Binária Comparada às Coligações \_bin”).

Nota

Dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

Uma literal de cadeia de caracteres pode ter um introduzidor de conjunto de caracteres opcional e a cláusula `COLLATE`, para designá-la como uma cadeia de caracteres que usa um conjunto de caracteres e uma ordenação específicos:

```sql
[_charset_name]'string' [COLLATE collation_name]
```

Exemplos:

```sql
SELECT _latin1'string';
SELECT _binary'string';
SELECT _utf8'string' COLLATE utf8_danish_ci;
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma string no conjunto de caracteres nacional. Essas declarações são equivalentes:

```sql
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```

Para obter informações sobre essas formas de sintaxe de cadeia, consulte a Seção 10.3.7, “O Conjunto Nacional de Caracteres”, e a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

Dentro de uma cadeia, certas sequências têm um significado especial, a menos que o modo `NO_BACKSLASH_ESCAPES` SQL esteja habilitado. Cada uma dessas sequências começa com uma barra invertida (`\`, conhecida como *caractere de escape*). O MySQL reconhece as sequências de escape mostradas na Tabela 9.1, “Sequências de Caracteres de Escape Especiais”. Para todas as outras sequências de escape, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências são sensíveis ao caso. Por exemplo, `\b` é interpretado como um espaço de volta, mas `\B` é interpretado como `B`. O processamento de escape é feito de acordo com o conjunto de caracteres indicado pela variável de sistema `character_set_connection`. Isso é verdadeiro mesmo para cadeias que são precedidas por um introduzir que indica um conjunto de caracteres diferente, conforme discutido na Seção 10.3.6, “Conjunto de Caracteres de Literal de Cadeia de Caracteres e Colaboração”.

**Tabela 9.1 Sequências de Escape de Caracteres Especiais**

<table summary="Escape sequences and the characters they represent."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Escape Sequence</th> <th>Personagem representado por sequência</th> </tr></thead><tbody><tr> <td><code>\0</code></td> <td>Um ASCII NUL (<code>X'00'</code>) personagem</td> </tr><tr> <td><code>\'</code></td> <td>Uma única citação (<code>'</code>) personagem</td> </tr><tr> <td><code>\"</code></td> <td>Uma citação dupla (<code>"</code>) personagem</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere de recuo</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova string (linefeed)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere de retorno de carro</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação</td> </tr><tr> <td><code>\Z</code></td> <td>ASCII 26 (Ctrl+Z); veja a nota após a tabela</td> </tr><tr> <td><code>\\</code></td> <td>Um traço de barra (<code>\</code>) personagem</td> </tr><tr> <td><code>\%</code></td> <td>A<code>%</code>característica; ver nota após a tabela</td> </tr><tr> <td><code>\_</code></td> <td>A<code>_</code>característica; ver nota após a tabela</td> </tr></tbody></table>

O caractere ASCII 26 pode ser codificado como `\Z` para permitir que você trabalhe em torno do problema de que o ASCII 26 representa FIM DE ARQUIVO no Windows. ASCII 26 dentro de um arquivo causa problemas se você tentar usar `mysql db_name < file_name`.

As sequências `\%` e `\_` são usadas para procurar instâncias literais de `%` e `_` em contextos de correspondência de padrões, onde, de outra forma, seriam interpretadas como caracteres curinga. Veja a descrição do operador `LIKE` na Seção 12.8.1, “Funções e operadores de comparação de strings”. Se você usar `\%` ou `\_` fora de contextos de correspondência de padrões, eles são avaliados para as strings `\%` e `\_`, não para `%` e `_`.

Existem várias maneiras de incluir caracteres de citação dentro de uma cadeia:

* Um `'` dentro de uma string citada com `'` pode ser escrito como `''`.

* Um `"` dentro de uma string citada com `"` pode ser escrito como `""`.

* Antecipe o caractere de citação com um caractere de escape (`\`).

* Um `'` dentro de uma string citada com `"` não precisa de tratamento especial e não precisa ser duplicado ou escamado. Da mesma forma, `"` dentro de uma string citada com `'` não precisa de tratamento especial.

As seguintes declarações `SELECT` demonstram como a citação e a fuga de trabalho funcionam:

```sql
mysql> SELECT 'hello', '"hello"', '""hello""', 'hel''lo', '\'hello';
+-------+---------+-----------+--------+--------+
| hello | "hello" | ""hello"" | hel'lo | 'hello |
+-------+---------+-----------+--------+--------+

mysql> SELECT "hello", "'hello'", "''hello''", "hel""lo", "\"hello";
+-------+---------+-----------+--------+--------+
| hello | 'hello' | ''hello'' | hel"lo | "hello |
+-------+---------+-----------+--------+--------+

mysql> SELECT 'This\nIs\nFour\nLines';
+--------------------+
| This
Is
Four
Lines |
+--------------------+

mysql> SELECT 'disappearing\ backslash';
+------------------------+
| disappearing backslash |
+------------------------+
```

Para inserir dados binários em uma coluna de string (como uma coluna `BLOB`, por exemplo), você deve representar certos caracteres por sequências de escape. O barra invertida (`\`) e o caractere de citação usado para citar a string devem ser escapados. Em certos ambientes de cliente, também pode ser necessário escapar `NUL` ou Control+Z. O cliente **mysql** corta as strings citadas que contêm caracteres `NUL` se não forem escapados, e Control+Z pode ser interpretado como FIM DE FICHAMENTO no Windows se não forem escapados. Para as sequências de escape que representam cada um desses caracteres, consulte a Tabela 9.1, “Sequências de escape de caracteres especiais”.

Ao escrever programas de aplicação, qualquer string que possa conter qualquer um desses caracteres especiais deve ser adequadamente escapada antes de a string ser usada como um valor de dados em uma declaração SQL que é enviada ao servidor MySQL. Você pode fazer isso de duas maneiras:

* Processe a string com uma função que escape os caracteres especiais. Em um programa em C, você pode usar a função `mysql_real_escape_string_quote()` da API C para escapar caracteres. Veja mysql\_real\_escape\_string\_quote(). Dentro das declarações SQL que constroem outras declarações SQL, você pode usar a função `QUOTE()`. A interface Perl DBI fornece um método `quote` para converter caracteres especiais nas sequências de escape apropriadas. Veja Seção 27.9, “MySQL Perl API”. Outras interfaces de linguagem podem fornecer uma capacidade semelhante.

* Como alternativa para escapar explicitamente de caracteres especiais, muitas APIs do MySQL fornecem uma capacidade de marcador de posição que permite inserir marcadores especiais em uma string de declaração e, em seguida, vincular os valores dos dados a eles quando você emitir a declaração. Neste caso, a API cuida da escapagem de caracteres especiais nos valores para você.

### 9.1.2 Literais Numéricos

Os literais de número incluem literais de valor exato (inteiro e `DECIMAL` - DECIMAL, NUMERIC")) e literais de valor aproximado (ponto flutuante).

Os inteiros são representados como uma sequência de dígitos. Os números podem incluir `.` como um separador decimal. Os números podem ser precedidos por `-` ou `+` para indicar um valor negativo ou positivo, respectivamente. Os números representados em notação científica com uma mantissa e expoente são números de valor aproximado.

Os literais numéricos de valor exato têm uma parte inteira ou fracionária, ou ambas. Eles podem ser assinados. Exemplos: `1`, `.2`, `3.4`, `-5`, `-6.78`, `+9.10`.

Os literais numéricos de valor aproximado são representados em notação científica com uma mantissa e expoente. Uma ou ambas as partes podem ser assinadas. Exemplos: `1.2E3`, `1.2E-3`, `-1.2E3`, `-1.2E-3`.

Dois números que parecem semelhantes podem ser tratados de maneira diferente. Por exemplo, `2.34` é um número de valor exato (ponto fixo), enquanto `2.34E0` é um número de valor aproximado (ponto flutuante).

O tipo de dados `DECIMAL` - DECIMAL, NUMERIC]") é um tipo de ponto fixo e os cálculos são exatos. No MySQL, o tipo `DECIMAL` - DECIMAL, NUMERIC]") tem vários sinônimos: `NUMERIC` - DECIMAL, NUMERIC"), `DEC` - DECIMAL, NUMERIC"), `FIXED` - DECIMAL, NUMERIC"). Os tipos inteiros também são tipos de valor exato. Para mais informações sobre cálculos de valor exato, consulte a Seção 12.21, “Matemática de Precisão”.

Os tipos de dados `FLOAT` - FLOAT, DOUBLE]") e `DOUBLE` - FLOAT, DOUBLE]") são tipos de ponto flutuante e os cálculos são aproximados. No MySQL, os tipos que são sinônimos de `FLOAT` - FLOAT, DOUBLE]") ou `DOUBLE` - FLOAT, DOUBLE]") são `DOUBLE PRECISION` - FLOAT, DOUBLE]") e `REAL` - FLOAT, DOUBLE").

Um número inteiro pode ser usado em contexto de ponto flutuante; ele é interpretado como o número equivalente em ponto flutuante.

### 9.1.3 Datas e horários literais

* Literais de data e hora SQL padrão e ODBC
* Literais de string e numéricos em contexto de data e hora

Os valores de data e hora podem ser representados em vários formatos, como strings citadas ou como números, dependendo do tipo exato do valor e de outros fatores. Por exemplo, em contextos em que o MySQL espera uma data, interpreta qualquer um dos `'2015-07-21'`, `'20150721'` e `20150721` como uma data.

Esta seção descreve os formatos aceitáveis para datas e horários literais. Para mais informações sobre os tipos de dados temporais, como a faixa de valores permitidos, consulte a Seção 11.2, “Tipos de dados de data e hora”.

#### Literais de data e hora SQL padrão e ODBC

O SQL padrão exige que os literais temporais sejam especificados usando uma palavra-chave de tipo e uma string. O espaço entre a palavra-chave e a string é opcional.

```sql
DATE 'str'
TIME 'str'
TIMESTAMP 'str'
```

O MySQL reconhece, mas, ao contrário do SQL padrão, não exige a palavra-chave tipo. As aplicações que devem ser compatíveis com o padrão devem incluir a palavra-chave tipo para literais temporais.

O MySQL também reconhece a sintaxe ODBC correspondente à sintaxe SQL padrão:

```sql
{ d 'str' }
{ t 'str' }
{ ts 'str' }
```

O MySQL utiliza as palavras-chave de tipo e as construções ODBC para produzir os valores `DATE`, `TIME` e `DATETIME`, respectivamente, incluindo uma parte fracionária de segundos se especificada. A sintaxe `TIMESTAMP` produz um valor `DATETIME` no MySQL porque `DATETIME` tem uma faixa que corresponde mais de perto ao tipo padrão SQL `TIMESTAMP`, que tem uma faixa de ano de `0001` a `9999`. (A faixa de ano do MySQL `TIMESTAMP` é `1970` a `2038`.

#### Literais de cadeia e numéricos em contexto de data e hora

O MySQL reconhece os valores `DATE` nesses formatos:

* Como uma cadeia em qualquer formato `'YYYY-MM-DD'` ou `'YY-MM-DD'`. Uma sintaxe "relaxada" é permitida: qualquer caractere de pontuação pode ser usado como delimitador entre as partes da data. Por exemplo, `'2012-12-31'`, `'2012/12/31'`, `'2012^12^31'` e `'2012@12@31'` são equivalentes.

* Como uma string sem delimitadores em qualquer formato `'YYYYMMDD'` ou `'YYMMDD'`, desde que a string faça sentido como uma data. Por exemplo, `'20070523'` e `'070523'` são interpretados como `'2007-05-23'`, mas `'071332'` é ilegal (tem partes de mês e dia sem sentido) e se torna `'0000-00-00'`.

* Como um número no formato de *`YYYYMMDD`* ou *`YYMMDD`*, desde que o número faça sentido como uma data. Por exemplo, `19830905` e `830905` são interpretados como `'1983-09-05'`.

O MySQL reconhece os valores `DATETIME` e `TIMESTAMP` nesses formatos:

* Como uma cadeia em qualquer formato de `'YYYY-MM-DD hh:mm:ss'` ou `'YY-MM-DD hh:mm:ss'`. Uma sintaxe "relaxada" também é permitida aqui: qualquer caractere de pontuação pode ser usado como delimitador entre partes de data ou partes de hora. Por exemplo, `'2012-12-31 11:30:45'`, `'2012^12^31 11+30+45'`, `'2012/12/31 11*30*45'` e `'2012@12@31 11^30^45'` são equivalentes.

O único delimitador reconhecido entre uma parte de data e hora e uma parte de segundos fracionários é o ponto decimal.

As partes de data e hora podem ser separadas por `T` em vez de um espaço. Por exemplo, `'2012-12-31 11:30:45'` `'2012-12-31T11:30:45'` são equivalentes.

* Como uma cadeia sem delimitadores em qualquer um dos formatos `'YYYYMMDDhhmmss'` ou `'YYMMDDhhmmss'`, desde que a cadeia faça sentido como uma data. Por exemplo, `'20070523091528'` e `'070523091528'` são interpretados como `'2007-05-23 09:15:28'`, mas `'071122129015'` é ilegal (tem uma parte de minuto sem sentido) e se torna `'0000-00-00 00:00:00'`.

* Como um número no formato de *`YYYYMMDDhhmmss`* ou *`YYMMDDhhmmss`*, desde que o número faça sentido como uma data. Por exemplo, `19830905132800` e `830905132800` são interpretados como `'1983-09-05 13:28:00'`.

Um valor de `DATETIME` ou `TIMESTAMP` pode incluir uma parte fracionária de segundos em até microsegundos (6 dígitos) de precisão. A parte fracionária deve sempre ser separada do resto do tempo por um ponto decimal; nenhum outro delimitador de segundos fracionários é reconhecido. Para informações sobre o suporte de segundos fracionários no MySQL, consulte a Seção 11.2.7, “Segundos Fracionários em Valores de Tempo”.

As datas que contêm valores de ano de duas casas decimais são ambíguas porque o século é desconhecido. O MySQL interpreta os valores de ano de duas casas decimais usando essas regras:

* Os valores do ano na faixa `70-99` se tornam `1970-1999`.

* Os valores do ano na faixa `00-69` se tornam `2000-2069`.

Veja também a Seção 11.2.10, “Anos de 2 dígitos em datas”.

Para valores especificados como strings que incluem delimitadores de parte de data, não é necessário especificar dois dígitos para valores de mês ou dia que são menores que `10`. `'2015-6-9'` é o mesmo que `'2015-06-09'`. Da mesma forma, para valores especificados como strings que incluem delimitadores de parte de hora, não é necessário especificar dois dígitos para valores de hora, minuto ou segundo que são menores que `10`. `'2015-10-30 1:2:3'` é o mesmo que `'2015-10-30 01:02:03'`.

Os valores especificados como números devem ter 6, 8, 12 ou 14 dígitos. Se um número tiver 8 ou 14 dígitos, presume-se que esteja no formato *`YYYYMMDD`* ou *`YYYYMMDDhhmmss`* e que o ano seja dado pelos primeiros 4 dígitos. Se o número tiver 6 ou 12 dígitos, presume-se que esteja no formato *`YYMMDD`* ou *`YYMMDDhhmmss`* e que o ano seja dado pelos primeiros 2 dígitos. Os números que não têm uma dessas comprimentos são interpretados como se estivessem preenchidos com zeros na direção da maior extensão.

Os valores especificados como cadeias não delimitadas são interpretados de acordo com sua comprimento. Para uma cadeia de 8 ou 14 caracteres, o ano é assumido como sendo dado pelos primeiros 4 caracteres. Caso contrário, o ano é assumido como sendo dado pelos primeiros 2 caracteres. A cadeia é interpretada de esquerda para direita para encontrar os valores de ano, mês, dia, hora, minuto e segundo, para tantas partes quanto estiverem presentes na cadeia. Isso significa que você não deve usar cadeias que tenham menos de 6 caracteres. Por exemplo, se você especificar `'9903'`, pensando que isso representa março de 1999, o MySQL a converte no valor de data “zero”. Isso ocorre porque os valores de ano e mês são `99` e `03`, mas a parte do dia está completamente ausente. No entanto, você pode especificar explicitamente um valor de zero para representar partes de mês ou dia ausentes. Por exemplo, para inserir o valor `'1999-03-00'`, use `'990300'`.

O MySQL reconhece os valores `TIME` nesses formatos:

* Como uma cadeia em formato *`'D hh:mm:ss'`*. Você também pode usar uma das seguintes sintaxes "relaxadas": *`'hh:mm:ss'`*, *`'hh:mm'`*, *`'D hh:mm'`*, *`'D hh'`* ou *`'ss'`*. Aqui *`D`* representa dias e pode ter um valor de 0 a 34.

* Como uma string sem delimitadores no formato *`'hhmmss'`*, desde que faça sentido como um tempo. Por exemplo, `'101112'` é entendido como `'10:11:12'`, mas `'109712'` é ilegal (tem uma parte de minuto sem sentido) e se torna `'00:00:00'`.

* Como um número no formato *`hhmmss`*, desde que faça sentido como um tempo. Por exemplo, `101112` é entendido como `'10:11:12'`. Os seguintes formatos alternativos também são entendidos: *`ss`*, *`mmss`* ou *`hhmmss`*.

Uma parte fracionária de segundos é reconhecida nos formatos de tempo *`'D hh:mm:ss.fraction'`*, *`'hh:mm:ss.fraction'`*, *`'hhmmss.fraction'`* e *`hhmmss.fraction`*, onde `fraction` é a parte fracionária em precisão de até microsegundos (6 dígitos). A parte fracionária deve sempre ser separada do resto do tempo por um ponto decimal; nenhum outro delimitador de segundos fracionários é reconhecido. Para informações sobre o suporte a segundos fracionários no MySQL, consulte a Seção 11.2.7, “Segundos Fracionários em Valores de Tempo”.

Para os valores `TIME` especificados como strings que incluem um delimitador de parte de tempo, não é necessário especificar dois dígitos para valores de horas, minutos ou segundos que são menores que `10`. `'8:3:2'` é o mesmo que `'08:03:02'`.

### 9.1.4 Literais hexadecimais

Os valores lógicos hexadecimais são escritos usando a notação `X'val'` ou `0xval`, onde *`val`* contém dígitos hexadecimais (`0..9`, `A..F`). A grafia maiúscula ou minúscula dos dígitos e de qualquer `X` inicial não importa. Um `0x` inicial é sensível à grafia e não pode ser escrito como `0X`.

Literais hexadecimais legais:

```sql
X'01AF'
X'01af'
x'01AF'
x'01af'
0x01AF
0x01af
```

Literais hexadecimais ilegais:

```sql
X'0G'   (G is not a hexadecimal digit)
0X01AF  (0X must be written as 0x)
```

Os valores escritos usando a notação `X'val'` devem conter um número par de dígitos ou ocorrerá um erro de sintaxe. Para corrigir o problema, complete o valor com um zero inicial:

```sql
mysql> SET @s = X'FFF';
ERROR 1064 (42000): You have an error in your SQL syntax;
check the manual that corresponds to your MySQL server
version for the right syntax to use near 'X'FFF''

mysql> SET @s = X'0FFF';
Query OK, 0 rows affected (0.00 sec)
```

Os valores escritos usando a notação `0xval` que contêm um número ímpar de dígitos são tratados como tendo um `0` adicional. Por exemplo, `0xaaa` é interpretado como `0x0aaa`.

Por padrão, uma literal hexadecimal é uma string binária, onde cada par de dígitos hexadecimais representa um caractere:

```sql
mysql> SELECT X'4D7953514C', CHARSET(X'4D7953514C');
+---------------+------------------------+
| X'4D7953514C' | CHARSET(X'4D7953514C') |
+---------------+------------------------+
| MySQL         | binary                 |
+---------------+------------------------+
mysql> SELECT 0x5461626c65, CHARSET(0x5461626c65);
+--------------+-----------------------+
| 0x5461626c65 | CHARSET(0x5461626c65) |
+--------------+-----------------------+
| Table        | binary                |
+--------------+-----------------------+
```

Um literal hexadecimal pode ter um introduzidor opcional de conjunto de caracteres e a cláusula `COLLATE`, para designá-lo como uma cadeia que usa um conjunto de caracteres e uma ordenação específicos:

```sql
[_charset_name] X'val' [COLLATE collation_name]
```

Exemplos:

```sql
SELECT _latin1 X'4D7953514C';
SELECT _utf8 0x4D7953514C COLLATE utf8_danish_ci;
```

Os exemplos utilizam a notação `X'val'`, mas a notação `0xval` também permite introdutores. Para informações sobre introdutores, consulte a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

Em contextos numéricos, o MySQL trata uma literal hexadecimal como um `BIGINT UNSIGNED` (inteiro sem sinal de 64 bits). Para garantir o tratamento numérico de uma literal hexadecimal, use-a em contexto numérico. As formas de fazer isso incluem adicionar 0 ou usar `CAST(... AS UNSIGNED)`. Por exemplo, uma literal hexadecimal atribuída a uma variável definida pelo usuário é uma string binária por padrão. Para atribuir o valor como um número, use-a em contexto numérico:

```sql
mysql> SET @v1 = X'41';
mysql> SET @v2 = X'41'+0;
mysql> SET @v3 = CAST(X'41' AS UNSIGNED);
mysql> SELECT @v1, @v2, @v3;
+------+------+------+
| @v1  | @v2  | @v3  |
+------+------+------+
| A    |   65 |   65 |
+------+------+------+
```

Um valor hexadecimal vazio (`X''`) é avaliado como uma cadeia binária de comprimento zero. Convertido em um número, ele produz 0:

```sql
mysql> SELECT CHARSET(X''), LENGTH(X'');
+--------------+-------------+
| CHARSET(X'') | LENGTH(X'') |
+--------------+-------------+
| binary       |           0 |
+--------------+-------------+
mysql> SELECT X''+0;
+-------+
| X''+0 |
+-------+
|     0 |
+-------+
```

A notação `X'val'` é baseada no SQL padrão. A notação `0x` é baseada no ODBC, para a qual cadeias hexadecimais são frequentemente usadas para fornecer valores para as colunas `BLOB`.

Para converter uma string ou um número em uma string no formato hexadecimal, use a função `HEX()`:

```sql
mysql> SELECT HEX('cat');
+------------+
| HEX('cat') |
+------------+
| 636174     |
+------------+
mysql> SELECT X'636174';
+-----------+
| X'636174' |
+-----------+
| cat       |
+-----------+
```

### 9.1.5 Literais de Valor de Bit

Os literais de valor de bit são escritos usando a notação `b'val'` ou `0bval`. *`val`* é um valor binário escrito usando zeros e uns. A maiúscula de qualquer `b` inicial não importa. Um `0b` inicial é sensível ao caso e não pode ser escrito como `0B`.

Literais de valor de bit legal:

```sql
b'01'
B'01'
0b01
```

Literais de valor de bit ilegais:

```sql
b'2'    (2 is not a binary digit)
0B01    (0B must be written as 0b)
```

Por padrão, um literal de valor de bit é uma string binária:

```sql
mysql> SELECT b'1000001', CHARSET(b'1000001');
+------------+---------------------+
| b'1000001' | CHARSET(b'1000001') |
+------------+---------------------+
| A          | binary              |
+------------+---------------------+
mysql> SELECT 0b1100001, CHARSET(0b1100001);
+-----------+--------------------+
| 0b1100001 | CHARSET(0b1100001) |
+-----------+--------------------+
| a         | binary             |
+-----------+--------------------+
```

Um literal de valor de bit pode ter um introduzidor de conjunto de caracteres opcional e a cláusula `COLLATE`, para designá-lo como uma string que usa um conjunto de caracteres e uma ordenação específicos:

```sql
[_charset_name] b'val' [COLLATE collation_name]
```

Exemplos:

```sql
SELECT _latin1 b'1000001';
SELECT _utf8 0b1000001 COLLATE utf8_danish_ci;
```

Os exemplos utilizam a notação `b'val'`, mas a notação `0bval` também permite introdutores. Para informações sobre introdutores, consulte a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

Em contextos numéricos, o MySQL trata um literal de bit como um inteiro. Para garantir o tratamento numérico de um literal de bit, use-o em um contexto numérico. As formas de fazer isso incluem adicionar 0 ou usar `CAST(... AS UNSIGNED)`. Por exemplo, um literal de bit atribuído a uma variável definida pelo usuário é uma string binária por padrão. Para atribuir o valor como um número, use-o em um contexto numérico:

```sql
mysql> SET @v1 = b'1100001';
mysql> SET @v2 = b'1100001'+0;
mysql> SET @v3 = CAST(b'1100001' AS UNSIGNED);
mysql> SELECT @v1, @v2, @v3;
+------+------+------+
| @v1  | @v2  | @v3  |
+------+------+------+
| a    |   97 |   97 |
+------+------+------+
```

Um valor de bit vazio (`b''`) é avaliado como uma cadeia binária de comprimento zero. Convertido em um número, ele produz 0:

```sql
mysql> SELECT CHARSET(b''), LENGTH(b'');
+--------------+-------------+
| CHARSET(b'') | LENGTH(b'') |
+--------------+-------------+
| binary       |           0 |
+--------------+-------------+
mysql> SELECT b''+0;
+-------+
| b''+0 |
+-------+
|     0 |
+-------+
```

A notação de valor de bit é conveniente para especificar os valores a serem atribuídos às colunas de `BIT`:

```sql
mysql> CREATE TABLE t (b BIT(8));
mysql> INSERT INTO t SET b = b'11111111';
mysql> INSERT INTO t SET b = b'1010';
mysql> INSERT INTO t SET b = b'0101';
```

Os valores de bit nos conjuntos de resultados são retornados como valores binários, que podem não ser exibidos adequadamente. Para converter um valor de bit para uma forma imprimível, use-o em um contexto numérico ou use uma função de conversão, como `BIN()` ou `HEX()`. Os dígitos de alta ordem 0 não são exibidos no valor convertido.

```sql
mysql> SELECT b+0, BIN(b), OCT(b), HEX(b) FROM t;
+------+----------+--------+--------+
| b+0  | BIN(b)   | OCT(b) | HEX(b) |
+------+----------+--------+--------+
|  255 | 11111111 | 377    | FF     |
|   10 | 1010     | 12     | A      |
|    5 | 101      | 5      | 5      |
+------+----------+--------+--------+
```

### 9.1.6 Literais Booleanos

As constantes `TRUE` e `FALSE` valem `1` e `0`, respectivamente. Os nomes das constantes podem ser escritos em qualquer caso de letra.

```sql
mysql> SELECT TRUE, true, FALSE, false;
        -> 1, 1, 0, 0
```

### 9.1.7 Valores nulos

O valor `NULL` significa “sem dados”. `NULL` pode ser escrito em qualquer caso de letra. Um sinônimo é `\N` (sensível ao caso). O tratamento de `\N` como sinônimo de `NULL` em declarações SQL é desaconselhado a partir do MySQL 5.7.18 e é removido no MySQL 8.0; use `NULL` em vez disso.

Tenha em atenção que o valor `NULL` é diferente dos valores como `0` para tipos numéricos ou a string vazia para tipos de string. Para mais informações, consulte a Seção B.3.4.3, “Problemas com valores NULL”.

Para operações de importação ou exportação de arquivos de texto realizadas com `LOAD DATA` ou `SELECT ... INTO OUTFILE`, `NULL` é representado pela sequência `\N`. Consulte a Seção 13.2.6, “Instrução LOAD DATA”. O uso de `\N` em arquivos de texto não é afetado pela depreciação de `\N` em declarações SQL.

Para a classificação com `ORDER BY`, os valores de `NULL` são classificados antes dos outros valores para classificações ascendentes, após os outros valores para classificações descendentes.