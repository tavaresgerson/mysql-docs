## 12.10 Conjuntos de caracteres e codificações suportados

Esta seção indica quais conjuntos de caracteres o MySQL suporta. Há uma subseção para cada grupo de conjuntos de caracteres relacionados. Para cada conjunto de caracteres, as colatões permitidas são listadas.

Para listar os conjuntos de caracteres disponíveis e suas colatações padrão, use a declaração `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`. Por exemplo:

```
mysql> SHOW CHARACTER SET;
+----------+---------------------------------+---------------------+--------+
| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| armscii8 | ARMSCII-8 Armenian              | armscii8_general_ci |      1 |
| ascii    | US ASCII                        | ascii_general_ci    |      1 |
| big5     | Big5 Traditional Chinese        | big5_chinese_ci     |      2 |
| binary   | Binary pseudo charset           | binary              |      1 |
| cp1250   | Windows Central European        | cp1250_general_ci   |      1 |
| cp1251   | Windows Cyrillic                | cp1251_general_ci   |      1 |
| cp1256   | Windows Arabic                  | cp1256_general_ci   |      1 |
| cp1257   | Windows Baltic                  | cp1257_general_ci   |      1 |
| cp850    | DOS West European               | cp850_general_ci    |      1 |
| cp852    | DOS Central European            | cp852_general_ci    |      1 |
| cp866    | DOS Russian                     | cp866_general_ci    |      1 |
| cp932    | SJIS for Windows Japanese       | cp932_japanese_ci   |      2 |
| dec8     | DEC West European               | dec8_swedish_ci     |      1 |
| eucjpms  | UJIS for Windows Japanese       | eucjpms_japanese_ci |      3 |
| euckr    | EUC-KR Korean                   | euckr_korean_ci     |      2 |
| gb18030  | China National Standard GB18030 | gb18030_chinese_ci  |      4 |
| gb2312   | GB2312 Simplified Chinese       | gb2312_chinese_ci   |      2 |
| gbk      | GBK Simplified Chinese          | gbk_chinese_ci      |      2 |
| geostd8  | GEOSTD8 Georgian                | geostd8_general_ci  |      1 |
| greek    | ISO 8859-7 Greek                | greek_general_ci    |      1 |
| hebrew   | ISO 8859-8 Hebrew               | hebrew_general_ci   |      1 |
| hp8      | HP West European                | hp8_english_ci      |      1 |
| keybcs2  | DOS Kamenicky Czech-Slovak      | keybcs2_general_ci  |      1 |
| koi8r    | KOI8-R Relcom Russian           | koi8r_general_ci    |      1 |
| koi8u    | KOI8-U Ukrainian                | koi8u_general_ci    |      1 |
| latin1   | cp1252 West European            | latin1_swedish_ci   |      1 |
| latin2   | ISO 8859-2 Central European     | latin2_general_ci   |      1 |
| latin5   | ISO 8859-9 Turkish              | latin5_turkish_ci   |      1 |
| latin7   | ISO 8859-13 Baltic              | latin7_general_ci   |      1 |
| macce    | Mac Central European            | macce_general_ci    |      1 |
| macroman | Mac West European               | macroman_general_ci |      1 |
| sjis     | Shift-JIS Japanese              | sjis_japanese_ci    |      2 |
| swe7     | 7bit Swedish                    | swe7_swedish_ci     |      1 |
| tis620   | TIS620 Thai                     | tis620_thai_ci      |      1 |
| ucs2     | UCS-2 Unicode                   | ucs2_general_ci     |      2 |
| ujis     | EUC-JP Japanese                 | ujis_japanese_ci    |      3 |
| utf16    | UTF-16 Unicode                  | utf16_general_ci    |      4 |
| utf16le  | UTF-16LE Unicode                | utf16le_general_ci  |      4 |
| utf32    | UTF-32 Unicode                  | utf32_general_ci    |      4 |
| utf8mb3  | UTF-8 Unicode                   | utf8mb3_general_ci  |      3 |
| utf8mb4  | UTF-8 Unicode                   | utf8mb4_0900_ai_ci  |      4 |
+----------+---------------------------------+---------------------+--------+
```

Nos casos em que um conjunto de caracteres tem múltiplas classificações, pode não ser claro qual classificação é mais adequada para uma aplicação específica. Para evitar escolher a classificação errada, pode ser útil realizar algumas comparações com valores de dados representativos para garantir que uma classificação específica ordene os valores da maneira que você espera.

### 12.10.1 Conjuntos de caracteres Unicode

Esta seção descreve as colatões disponíveis para conjuntos de caracteres Unicode e suas propriedades diferenciadoras. Para informações gerais sobre Unicode, consulte a Seção 12.9, “Suporte Unicode”.

O MySQL suporta vários conjuntos de caracteres Unicode:

* `utf8mb4`: Uma codificação UTF-8 do conjunto de caracteres Unicode, usando de um a quatro bytes por caractere.

* `utf8mb3`: Uma codificação UTF-8 do conjunto de caracteres Unicode usando de um a três bytes por caractere. Este conjunto de caracteres é descontinuado no MySQL 8.0, e você deve usar `utf8mb4` em vez disso.

* `utf8`: Um alias para `utf8mb3`. No MySQL 8.0, este alias é desatualizado; use `utf8mb4` em vez disso. `utf8` é esperado em uma versão futura para se tornar um alias para `utf8mb4`.

* `ucs2`: A codificação UCS-2 do conjunto de caracteres Unicode usando dois bytes por caractere. Desatualizada no MySQL 8.0.28; você deve esperar que o suporte a este conjunto de caracteres seja removido em uma versão futura.

* `utf16`: A codificação UTF-16 para o conjunto de caracteres Unicode que utiliza dois ou quatro bytes por caractere. Assim como `ucs2`, mas com uma extensão para caracteres suplementares.

* `utf16le`: O codificação UTF-16LE para o conjunto de caracteres Unicode. Como `utf16`, mas little-endian em vez de big-endian.

* `utf32`: A codificação UTF-32 para o conjunto de caracteres Unicode, usando quatro bytes por caractere.

Nota

O conjunto de caracteres `utf8mb3` é desatualizado e você deve esperar que ele seja removido em um lançamento futuro do MySQL. Por favor, use `utf8mb4` em vez disso. `utf8` atualmente é um alias para `utf8mb3`, mas agora é desatualizado como tal, e `utf8` é esperado que, posteriormente, se torne uma referência para `utf8mb4`. A partir do MySQL 8.0.28, `utf8mb3` também é exibido no lugar de `utf8` em colunas de tabelas do Schema de Informações e na saída das declarações SQL `SHOW`.

Para evitar ambiguidades sobre o significado de `utf8`, considere especificar explicitamente `utf8mb4` para referências de conjunto de caracteres.

`utf8mb4`, `utf16`, `utf16le` e `utf32` suportam caracteres do Plano Multilíngue Básico (BMP) e caracteres suplementares que estão fora do BMP. `utf8mb3` e `ucs2` só suportam caracteres do BMP.

A maioria dos conjuntos de caracteres Unicode tem uma ordenação geral (indicada por `_general` no nome ou pela ausência de um especificador de idioma), uma ordenação binária (indicada por `_bin` no nome) e várias ordenações específicas para idiomas (indicadas por especificadores de idioma). Por exemplo, para `utf8mb4`, `utf8mb4_general_ci` e `utf8mb4_bin` são suas ordenações gerais e binárias, e `utf8mb4_danish_ci` é uma de suas ordenações específicas para idiomas.

A maioria dos conjuntos de caracteres tem uma única ordenação binária. `utf8mb4` é uma exceção que tem duas: `utf8mb4_bin` e (a partir do MySQL 8.0.17) `utf8mb4_0900_bin`. Essas duas ordenações binárias têm o mesmo ordem de classificação, mas são distinguidas por seus atributos de almofada e características de peso de classificação. Veja Atributos de Pad de Ordenação e Pesos de Ordenação de Caracteres.

O suporte de cotação para `utf16le` é limitado. As únicas cotações disponíveis são `utf16le_general_ci` e `utf16le_bin`. Essas são semelhantes a `utf16_general_ci` e `utf16_bin`.

* Algoritmo de Cotação Unicode (UCA) Versões * Atributos de Padrão de Cotação * Cotações Específicas ao Idioma * Cotações _general_ci Versus _unicode_ci * Pesos de Cotação de Caracteres * Informações Diversas

#### Versões do Algoritmo de Cotação Unicode (UCA)

O MySQL implementa as colatões `xxx_unicode_ci` de acordo com o Algoritmo de Colatação Unicode (UCA) descrito em <http://www.unicode.org/reports/tr10/>. A colatação utiliza as chaves de peso UCA versão-4.0.0: <http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>. As colatões `xxx_unicode_ci` têm suporte parcial apenas para o Algoritmo de Colatação Unicode. Alguns caracteres não são suportados, e as marcas de combinação não são totalmente suportadas. Isso afeta idiomas como o vietnamita, o yoruba e o navajo. Um caractere combinado é considerado diferente do mesmo caractere escrito com um único caractere unicode em comparações de string, e os dois caracteres são considerados ter um comprimento diferente (por exemplo, conforme retornado pela função `CHAR_LENGTH()` ou nos metadados do conjunto de resultados).

As codificações Unicode baseadas em versões do UCA superiores a 4.0.0 incluem a versão no nome da codificação. Exemplos:

* `utf8mb4_unicode_520_ci` é baseado nas chaves de peso da UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>),

* `utf8mb4_0900_ai_ci` é baseado nas chaves de peso da UCA 9.0.0 (<http://www.unicode.org/Public/UCA/9.0.0/allkeys.txt>).

As funções `LOWER()` e `UPPER()` realizam a minificação de caracteres de acordo com a collation de seus argumentos. Um caractere que possui versões maiúsculas e minúsculas apenas em uma versão Unicode superior a 4.0.0 é convertido por essas funções apenas se a collation do argumento usa uma versão UCA alta o suficiente.

#### Atributos do Pad de Colaboração

As collation baseadas na UCA 9.0.0 e superior são mais rápidas do que as collation baseadas em versões da UCA anteriores a 9.0.0. Elas também possuem um atributo de pad `NO PAD`, em contraste com `PAD SPACE` como usado em collation baseadas em versões da UCA anteriores a 9.0.0. Para comparação de strings não binárias, as collation `NO PAD` tratam espaços no final das strings como qualquer outro caractere (ver Tratamento de Espaço Final em Comparativos).

Para determinar o atributo do cartão para uma correção, use a tabela `INFORMATION_SCHEMA` `COLLATIONS`, que possui uma coluna `PAD_ATTRIBUTE`. Por exemplo:

```
mysql> SELECT COLLATION_NAME, PAD_ATTRIBUTE
       FROM INFORMATION_SCHEMA.COLLATIONS
       WHERE CHARACTER_SET_NAME = 'utf8mb4';
+----------------------------+---------------+
| COLLATION_NAME             | PAD_ATTRIBUTE |
+----------------------------+---------------+
| utf8mb4_general_ci         | PAD SPACE     |
| utf8mb4_bin                | PAD SPACE     |
| utf8mb4_unicode_ci         | PAD SPACE     |
| utf8mb4_icelandic_ci       | PAD SPACE     |
...
| utf8mb4_0900_ai_ci         | NO PAD        |
| utf8mb4_de_pb_0900_ai_ci   | NO PAD        |
| utf8mb4_is_0900_ai_ci      | NO PAD        |
...
| utf8mb4_ja_0900_as_cs      | NO PAD        |
| utf8mb4_ja_0900_as_cs_ks   | NO PAD        |
| utf8mb4_0900_as_ci         | NO PAD        |
| utf8mb4_ru_0900_ai_ci      | NO PAD        |
| utf8mb4_ru_0900_as_cs      | NO PAD        |
| utf8mb4_zh_0900_as_cs      | NO PAD        |
| utf8mb4_0900_bin           | NO PAD        |
+----------------------------+---------------+
```

A comparação de valores de cadeia não binários (`CHAR`, `VARCHAR` e `TEXT`) que possuem uma ordenação `NO PAD` difere de outras ordenações em relação a espaços finais. Por exemplo, `'a'` e `'a '` são considerados como strings diferentes, e não como a mesma string. Isso pode ser visto usando as ordenações binárias para `utf8mb4`. O atributo pad para `utf8mb4_bin` é `PAD SPACE`, enquanto para `utf8mb4_0900_bin` é `NO PAD`. Consequentemente, operações que envolvem `utf8mb4_0900_bin` não adicionam espaços finais, e comparações que envolvem strings com espaços finais podem diferir nas duas ordenações:

```
mysql> CREATE TABLE t1 (c CHAR(10) COLLATE utf8mb4_bin);
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t1 VALUES('a');
Query OK, 1 row affected (0.01 sec)

mysql> SELECT * FROM t1 WHERE c = 'a ';
+------+
| c    |
+------+
| a    |
+------+
1 row in set (0.00 sec)

mysql> ALTER TABLE t1 MODIFY c CHAR(10) COLLATE utf8mb4_0900_bin;
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM t1 WHERE c = 'a ';
Empty set (0.00 sec)
```

#### Colagens específicas para idioma

O MySQL implementa colas Unicode específicas para cada idioma se a ordenação baseada apenas no Algoritmo de Coloração Unicode (UCA) não funcionar bem para um idioma. As colas específicas para cada idioma são baseadas no UCA, com regras adicionais de personalização do idioma. Exemplos dessas regras aparecem mais adiante nesta seção. Para questões sobre ordens de idioma específicas, <http://unicode.org> fornece gráficos de coloração do Repositório de Dados de Local Comum (CLDR) em <http://www.unicode.org/cldr/charts/30/collation/index.html>.

Por exemplo, as codificações Unicode `utf8mb4_0900_ai_ci` não específicas de linguagem e `utf8mb4_LOCALE_0900_ai_ci` específicas de linguagem, cada uma delas, têm essas características:

* A agregação é baseada em UCA 9.0.0 e CLDR v30, é insensível ao acento e à grafia. Essas características são indicadas por `_0900`, `_ai` e `_ci` no nome da agregação. Exceção: `utf8mb4_la_0900_ai_ci` não é baseado no CLDR porque o Latim Clássico não é definido no CLDR.

* A agregação funciona para todos os caracteres na faixa [U+0, U+10FFFF].

* Se a ordenação não for específica para o idioma, ela ordena todos os caracteres, incluindo caracteres suplementares, na ordem padrão (descrita a seguir). Se a ordenação for específica para o idioma, ela ordena os caracteres do idioma corretamente de acordo com as regras específicas do idioma, e os caracteres que não estão no idioma na ordem padrão.

* Por padrão, a ordenação de caracteres que possuem um ponto de código listado na tabela DUCET (Tabela de Elementos de Colagem Unicode Padrão) é feita de acordo com o valor de peso atribuído na tabela. A ordenação de caracteres que não possuem um ponto de código listado na tabela DUCET é feita de acordo com seu valor de peso implícito, que é construído de acordo com a UCA.

* Para colas de caracteres que não são específicas para o idioma, os caracteres em sequências de contração são tratados como caracteres separados. Para colas de caracteres específicas para o idioma, as contrações podem alterar a ordem de classificação dos caracteres.

Um nome de agregação que inclui um código de localização ou nome de idioma mostrado na tabela a seguir é uma agregação específica para idioma. Os conjuntos de caracteres Unicode podem incluir colasções para um ou mais desses idiomas.

**Tabela 12.3 Especificadores de idioma de colocação Unicode**

<table summary="Language specifiers for Unicode character set collations."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Language</th> <th>Language Specifier</th> </tr></thead><tbody><tr> <td>Bosnian</td> <td><code>bs</code></td> </tr><tr> <td>Bulgarian</td> <td><code>bg</code></td> </tr><tr> <td>Chinese</td> <td><code>zh</code></td> </tr><tr> <td>Classical Latin</td> <td><code>la</code> or <code>roman</code></td> </tr><tr> <td>Croatian</td> <td><code>hr</code> or <code>croatian</code></td> </tr><tr> <td>Czech</td> <td><code>cs</code> or <code>czech</code></td> </tr><tr> <td>Danish</td> <td><code>da</code> or <code>danish</code></td> </tr><tr> <td>Esperanto</td> <td><code>eo</code> or <code>esperanto</code></td> </tr><tr> <td>Estonian</td> <td><code>et</code> or <code>estonian</code></td> </tr><tr> <td>Galician</td> <td><code>gl</code></td> </tr><tr> <td>German phone book order</td> <td><code>de_pb</code> or <code>german2</code></td> </tr><tr> <td>Hungarian</td> <td><code>hu</code> or <code>hungarian</code></td> </tr><tr> <td>Icelandic</td> <td><code>is</code> or <code>icelandic</code></td> </tr><tr> <td>Japanese</td> <td><code>ja</code></td> </tr><tr> <td>Latvian</td> <td><code>lv</code> or <code>latvian</code></td> </tr><tr> <td>Lithuanian</td> <td><code>lt</code> or <code>lithuanian</code></td> </tr><tr> <td>Mongolian</td> <td><code>mn</code></td> </tr><tr> <td>Norwegian / Bokmål</td> <td><code>nb</code></td> </tr><tr> <td>Norwegian / Nynorsk</td> <td><code>nn</code></td> </tr><tr> <td>Persian</td> <td><code>persian</code></td> </tr><tr> <td>Polish</td> <td><code>pl</code> or <code>polish</code></td> </tr><tr> <td>Romanian</td> <td><code>ro</code> or <code>romanian</code></td> </tr><tr> <td>Russian</td> <td><code>ru</code></td> </tr><tr> <td>Serbian</td> <td><code>sr</code></td> </tr><tr> <td>Sinhala</td> <td><code>sinhala</code></td> </tr><tr> <td>Slovak</td> <td><code>sk</code> or <code>slovak</code></td> </tr><tr> <td>Slovenian</td> <td><code>sl</code> or <code>slovenian</code></td> </tr><tr> <td>Modern Spanish</td> <td><code>es</code> or <code>spanish</code></td> </tr><tr> <td>Traditional Spanish</td> <td><code>es_trad</code> or <code>spanish2</code></td> </tr><tr> <td>Swedish</td> <td><code>sv</code> or <code>swedish</code></td> </tr><tr> <td>Turkish</td> <td><code>tr</code> or <code>turkish</code></td> </tr><tr> <td>Vietnamese</td> <td><code>vi</code> or <code>vietnamese</code></td> </tr></tbody></table>

O MySQL 8.0.30 e as versões posteriores fornecem as colatões búlgaras `utf8mb4_bg_0900_ai_ci` e `utf8mb4_bg_0900_as_cs`.

As colorações croatas são adaptadas para essas letras croatas: `Č`, `Ć`, `Dž`, `Đ`, `Lj`, `Nj`, `Š`, `Ž`.

O MySQL 8.0.30 e versões posteriores fornecem as colatinas `utf8mb4_sr_latn_0900_ai_ci` e `utf8mb4_sr_latn_0900_as_cs` para o sérvio e as colatinas `utf8mb4_bs_0900_ai_ci` e `utf8mb4_bs_0900_as_cs` para o bósnio, quando essas línguas são escritas com o alfabeto latino.

A partir do MySQL 8.0.30, o MySQL oferece colatões para as principais variedades do norueguês: para Bokmål, você pode usar `utf8mb4_nb_0900_ai_ci` e `utf8mb4_nb_0900_as_cs`; para Nynorsk, o MySQL agora oferece `utf8mb4_nn_0900_ai_ci` e `utf8mb4_nn_0900_as_cs`.

Para o japonês, o conjunto de caracteres `utf8mb4` inclui as colatações `utf8mb4_ja_0900_as_cs` e `utf8mb4_ja_0900_as_cs_ks`. Ambas as colatações são sensíveis ao acento e sensíveis ao caso. `utf8mb4_ja_0900_as_cs_ks` também é sensível ao kana e distingue caracteres de Katakana de caracteres de Hiragana, enquanto `utf8mb4_ja_0900_as_cs` trata caracteres de Katakana e Hiragana como iguais para classificação. Aplicações que exigem uma colatação japonesa, mas não sensibilidade ao kana, podem usar `utf8mb4_ja_0900_as_cs` para melhor desempenho de classificação. `utf8mb4_ja_0900_as_cs` usa três níveis de peso para classificação; `utf8mb4_ja_0900_as_cs_ks` usa quatro.

Para as codificações latinas clássicas que não são sensíveis ao acento, `I` e `J` são considerados iguais, e `U` e `V` são considerados iguais. `I` e `J`, e `U` e `V` são considerados iguais no nível da letra base. Em outras palavras, `J` é considerado um `I` acentuado, e `U` é considerado um `V` acentuado.

O MySQL 8.0.30 e versões posteriores oferecem colatinas para o idioma mongol quando escrito com caracteres cirílicos, `utf8mb4_mn_cyrl_0900_ai_ci` e `utf8mb4_mn_cyrl_0900_as_cs`.

As colorações espanholas estão disponíveis para o espanhol moderno e tradicional. Para ambos, `ñ` (n-tilde) é uma letra separada entre `n` e `o`. Além disso, para o espanhol tradicional, `ch` é uma letra separada entre `c` e `d`, e `ll` é uma letra separada entre `l` e `m`.

As collation tradicionais espanholas também podem ser usadas para Asturiano e Galego. A partir do MySQL 8.0.30, o MySQL também fornece as collation `utf8mb4_gl_0900_ai_ci` e `utf8mb4_gl_0900_as_cs` para Galego. (Estas são as mesmas collation que `utf8mb4_es_0900_ai_ci` e `utf8mb4_es_0900_as_cs`, respectivamente.)

As collationações suecos incluem regras suecos. Por exemplo, em sueco, a seguinte relação se mantém, o que não é algo esperado por um falante alemão ou francês:

```
Ü = Y < Ö
```

#### _ci_geral_ vs. _ci_unicode_ Colagens

Para qualquer conjunto de caracteres Unicode, as operações realizadas usando a cotação `xxx_general_ci` são mais rápidas do que as realizadas para a cotação `xxx_unicode_ci`. Por exemplo, as comparações para a cotação `utf8mb4_general_ci` são mais rápidas, mas um pouco menos corretas, do que as comparações para `utf8mb4_unicode_ci`. A razão é que `utf8mb4_unicode_ci` suporta mapeamentos como expansões; ou seja, quando um caractere é comparado como igual a combinações de outros caracteres. Por exemplo, `ß` é igual a `ss` em alemão e em algumas outras línguas. `utf8mb4_unicode_ci` também suporta contrações e caracteres ignoráveis. `utf8mb4_general_ci` é uma cotação de legado que não suporta expansões, contrações ou caracteres ignoráveis. Ela pode realizar apenas comparações um-para-um entre caracteres.

Para ilustrar ainda mais, as seguintes igualdades se aplicam tanto ao `utf8mb4_general_ci` quanto ao `utf8mb4_unicode_ci` (para o efeito disso em comparações ou pesquisas, consulte a Seção 12.8.6, “Exemplos do Efeito da Colagem”):

```
Ä = A
Ö = O
Ü = U
```

Uma diferença entre as colatações é que isso é verdadeiro para `utf8mb4_general_ci`:

```
ß = s
```

Enquanto isso é verdade para `utf8mb4_unicode_ci`, que suporta a ordem alemã DIN-1 (também conhecida como ordem de dicionário):

```
ß = ss
```

O MySQL implementa colas Unicode específicas para cada idioma se a ordenação com `utf8mb4_unicode_ci` não funcionar bem para um idioma. Por exemplo, `utf8mb4_unicode_ci` funciona bem para a ordem do dicionário alemão e francês, então não há necessidade de criar colas especiais `utf8mb4`.

`utf8mb4_general_ci` também é satisfatório tanto para alemão quanto para francês, exceto que `ß` é igual a `s`, e não a `ss`. Se isso for aceitável para sua aplicação, você deve usar `utf8mb4_general_ci`, porque é mais rápido. Se isso não for aceitável (por exemplo, se você precisar da ordem do dicionário alemão), use `utf8mb4_unicode_ci`, porque é mais preciso.

Se você precisar de uma encomenda em alemão DIN-2 (livro telefônico), use a agregação `utf8mb4_german2_ci`, que compara os seguintes conjuntos de caracteres como iguais:

```
Ä = Æ = AE
Ö = Œ = OE
Ü = UE
ß = ss
```

`utf8mb4_german2_ci` é semelhante a `latin1_german2_ci`, mas este último não compara `Æ` igual a `AE` ou `Œ` igual a `OE`. Não há `utf8mb4_german_ci` correspondente a `latin1_german_ci` para a ordem do dicionário alemão porque `utf8mb4_general_ci` é suficiente.

#### Pesos de Coleta de Caracteres

O peso de agregação de um personagem é determinado da seguinte forma:

* Para todas as codificações Unicode, exceto as `_bin` (binárias), o MySQL realiza uma pesquisa na tabela para encontrar o peso de ordenação de um caractere.

* Para as `_bin` colatações, exceto `utf8mb4_0900_bin`, o peso é baseado no ponto de código, possivelmente com bytes de zero inicial adicionados.

* Para `utf8mb4_0900_bin`, o peso são os bytes de codificação `utf8mb4`. A ordem de classificação é a mesma que para `utf8mb4_bin`, mas muito mais rápida.

Os pesos de ordenação podem ser exibidos usando a função `WEIGHT_STRING()`. (Veja a Seção 14.8, “Funções e Operadores de String”.) Se uma ordenação usa uma tabela de pesquisa de peso, mas um caractere não está na tabela (por exemplo, porque é um caractere “novo”), a determinação do peso de ordenação se torna mais complexa:

* Para caracteres BMP em colagens gerais (`xxx_general_ci`), o peso é o ponto de código.

* Para caracteres BMP em colatações UCA (por exemplo, `xxx_unicode_ci` e colatações específicas para idioma), o seguinte algoritmo se aplica:

  ```
  if (code >= 0x3400 && code <= 0x4DB5)
    base= 0xFB80; /* CJK Ideograph Extension */
  else if (code >= 0x4E00 && code <= 0x9FA5)
    base= 0xFB40; /* CJK Ideograph */
  else
    base= 0xFBC0; /* All other characters */
  aaaa= base +  (code >> 15);
  bbbb= (code & 0x7FFF) | 0x8000;
  ```

O resultado é uma sequência de dois elementos de correção, `aaaa` seguido de `bbbb`. Por exemplo:

  ```
  mysql> SELECT HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci));
  +----------------------------------------------------------+
  | HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci)) |
  +----------------------------------------------------------+
  | FBC084CF                                                 |
  +----------------------------------------------------------+
  ```

Assim, `U+04cf CYRILLIC SMALL LETTER PALOCHKA` (`ӏ`) é, com todas as colatões UCA 4.0.0, maior que `U+04c0 CYRILLIC LETTER PALOCHKA` (`Ӏ`). Com colatões UCA 5.2.0, todas as palochkas são ordenadas juntas.

* Para caracteres suplementares em colatações gerais, o peso é o peso para `0xfffd REPLACEMENT CHARACTER`. Para caracteres suplementares em colatações UCA 4.0.0, seu peso de colatação é `0xfffd`. Isso significa que, para o MySQL, todos os caracteres suplementares são iguais entre si e maiores que quase todos os caracteres BMP.

Um exemplo com caracteres Deseret e `COUNT(DISTINCT)`:

  ```
  CREATE TABLE t (s1 VARCHAR(5) CHARACTER SET utf32 COLLATE utf32_unicode_ci);
  INSERT INTO t VALUES (0xfffd);   /* REPLACEMENT CHARACTER */
  INSERT INTO t VALUES (0x010412); /* DESERET CAPITAL LETTER BEE */
  INSERT INTO t VALUES (0x010413); /* DESERET CAPITAL LETTER TEE */
  SELECT COUNT(DISTINCT s1) FROM t;
  ```

O resultado é 2 porque, nas colatações `xxx_unicode_ci` do MySQL, o caractere de substituição tem um peso de `0x0dc6`, enquanto Deseret Bee e Deseret Tee têm um peso de `0xfffd`. (Se a colatação `utf32_general_ci` fosse usada em vez disso, o resultado seria 1 porque todos os três caracteres têm um peso de `0xfffd` nessa colatação.)

Um exemplo com caracteres cuneiformes e `WEIGHT_STRING()`:

  ```
  /*
  The four characters in the INSERT string are
  00000041  # LATIN CAPITAL LETTER A
  0001218F  # CUNEIFORM SIGN KAB
  000121A7  # CUNEIFORM SIGN KISH
  00000042  # LATIN CAPITAL LETTER B
  */
  CREATE TABLE t (s1 CHAR(4) CHARACTER SET utf32 COLLATE utf32_unicode_ci);
  INSERT INTO t VALUES (0x000000410001218f000121a700000042);
  SELECT HEX(WEIGHT_STRING(s1)) FROM t;
  ```

O resultado é:

  ```
  0E33 FFFD FFFD 0E4A
  ```

`0E33` e `0E4A` são pesos primários, conforme mencionado em [UCA 4.0.0](ftp://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt). `FFFD` é o peso para KAB e também para KISH.

A regra de que todos os caracteres suplementares são iguais entre si não é ótima, mas não se espera que cause problemas. Esses caracteres são muito raros, então é muito raro que uma string de vários caracteres consista inteiramente de caracteres suplementares. No Japão, como os caracteres suplementares são ideogramas Kanji obscuros, o usuário típico não se importa com a ordem, de qualquer maneira. Se você realmente quer as linhas ordenadas de acordo com a regra do MySQL e secundariamente pelo valor do ponto de código, é fácil:

  ```
  ORDER BY s1 COLLATE utf32_unicode_ci, s1 COLLATE utf32_bin
  ```

* Para caracteres suplementares baseados em versões UCA superiores a 4.0.0 (por exemplo, `xxx_unicode_520_ci`), os caracteres suplementares não necessariamente têm o mesmo peso de colocação. Alguns têm pesos explícitos do arquivo UCA `allkeys.txt`. Outros têm pesos calculados a partir deste algoritmo:

  ```
  aaaa= base +  (code >> 15);
  bbbb= (code & 0x7FFF) | 0x8000;
  ```

Há uma diferença entre “ordenar pelo valor do código do personagem” e “ordenar pela representação binária do personagem”, uma diferença que aparece apenas com `utf16_bin`, devido aos surrogados.

Suponha que `utf16_bin` (a colocação binária para `utf16`) fosse uma comparação binária “byte por byte” em vez de “caractere por caractere”. Se assim fosse, a ordem dos caracteres em `utf16_bin` diferia da ordem em `utf8mb4_bin`. Por exemplo, o seguinte gráfico mostra dois caracteres raros. O primeiro caractere está na faixa `E000`-`FFFF`, portanto, é maior que um surogado, mas menor que um suplementar. O segundo caractere é um suplementar.

```
Code point  Character                    utf8mb4      utf16
----------  ---------                    -------      -----
0FF9D       HALFWIDTH KATAKANA LETTER N  EF BE 9D     FF 9D
10384       UGARITIC LETTER DELTA        F0 90 8E 84  D8 00 DF 84
```

Os dois caracteres no gráfico estão em ordem pelo valor do ponto de código porque `0xff9d` < [[PH_ICD_236]]. And they are in order by [[PH_ICD_237]] value because [[PH_ICD_238]] < [[PH_ICD_239]]. But they are not in order by [[PH_ICD_240]] value, if we use byte-by-byte comparison, because [[PH_ICD_241]] > `0xd8`.

Portanto, a codificação de collation `utf16_bin` do MySQL não é “caractere por caractere”. É “por ponto de código”. Quando o MySQL vê uma codificação de caracteres suplementar em `utf16`, ela converte para o valor do ponto de código do caractere, e então compara. Portanto, `utf8mb4_bin` e `utf16_bin` são os mesmos ordenamentos. Isso é consistente com o requisito do padrão SQL:2008 para uma collation UCS_BASIC: “UCS_BASIC é uma collation na qual a ordenação é determinada inteiramente pelos valores escalares Unicode dos caracteres nas cadeias de caracteres que estão sendo ordenadas. É aplicável ao repertório de caracteres UCS. Como todo repertório de caracteres é um subconjunto do repertório UCS, a collation UCS_BASIC é potencialmente aplicável a todo conjunto de caracteres. NOTA 11: O valor escalar Unicode de um caractere é seu ponto de código tratado como um inteiro não sinalizado.”

Se o conjunto de caracteres for `ucs2`, a comparação é caracter a caractere, mas as cadeias de caracteres de `ucs2` não devem conter suportes, de qualquer forma.

#### Informações Diversas

As colatações `xxx_general_mysql500_ci` preservam a ordem pré-5.1.24 das colatações originais `xxx_general_ci` e permitem atualizações para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).

### 12.10.1 Conjuntos de Caracteres do Oeste da Europa

Os conjuntos de caracteres do oeste da Europa cobrem a maioria das línguas do oeste da Europa, como francês, espanhol, catalão, basco, português, italiano, albanês, holandês, alemão, dinamarquês, sueco, norueguês, finlandês, feroês, islandês, irlandês, escocês e inglês.

* `ascii` (colações ASCII US):

+ `ascii_bin`
  + `ascii_general_ci` (padrão)
* `cp850` (colagens do Oeste da Europa do Sudoeste):

+ `cp850_bin`
  + `cp850_general_ci` (padrão)
* `dec8` (coligações de DEC para Europa Ocidental):

+ `dec8_bin`
  + `dec8_swedish_ci` (padrão)

O conjunto de caracteres `dec` é descontinuado no MySQL 8.0.28; espera-se que o suporte para ele seja removido em uma versão subsequente do MySQL.

* `hp8` (HP para Europa Ocidental) coligações:

+ `hp8_bin`  
  + `hp8_english_ci` (padrão)

O conjunto de caracteres `hp8` é descontinuado no MySQL 8.0.28; espera-se que o suporte para ele seja removido em uma versão subsequente do MySQL.

* `latin1` (cp1252 Europa Ocidental) coligações:

+ `latin1_bin`
  + `latin1_danish_ci`
  + `latin1_general_ci`
  + `latin1_general_cs`
  + `latin1_german1_ci`
  + `latin1_german2_ci`
  + `latin1_spanish_ci`
  + `latin1_swedish_ci` (padrão)

O `latin1` do MySQL é o mesmo que o conjunto de caracteres `cp1252` do Windows. Isso significa que é o mesmo que o oficial `ISO 8859-1` ou a `latin1` da IANA (Autoridade Atribuída de Números da Internet), exceto que a IANA `latin1` trata os pontos de código entre `0x80` e `0x9f` como “definido”, enquanto o `cp1252`, e, portanto, o MySQL `latin1`, atribui caracteres para essas posições. Por exemplo, o `0x80` é o símbolo do Euro. Para as entradas “definidas” em `cp1252`, o MySQL traduz `0x81` para o Unicode `0x0081`, `0x8d` para `0x008d`, `0x8f` para `0x008f`, `0x90` para `0x0090`, e `0x9d` para `0x009d`.

A ordenação `latin1_swedish_ci` é a padrão que provavelmente é usada pela maioria dos clientes do MySQL. Embora seja frequentemente dito que ela é baseada nas regras de ordenação sueco/finlandês, há suecos e finlandeses que discordam dessa afirmação.

As colatações `latin1_german1_ci` e `latin1_german2_ci` são baseadas nas normas DIN-1 e DIN-2, onde DIN significa *Deutsches Institut für Normung* (o equivalente alemão de ANSI). DIN-1 é chamada de "colatação de dicionário" e DIN-2 é chamada de "colatação de catálogo telefônico". Para um exemplo do efeito que isso tem em comparações ou ao fazer pesquisas, veja a Seção 12.8.6, "Exemplos do Efeito da Colatação".

+ `latin1_german1_ci` (dicionário) regras:

    ```
    Ä = A
    Ö = O
    Ü = U
    ß = s
    ```

+ `latin1_german2_ci` (livro telefônico):

    ```
    Ä = AE
    Ö = OE
    Ü = UE
    ß = ss
    ```

Na ordenação `latin1_spanish_ci`, `ñ` (n-tilde) é uma letra separada entre `n` e `o`.

* `macroman` (Mac West European) colations:

+ `macroman_bin`
  + `macroman_general_ci` (padrão)

`macroroman` é descontinuado no MySQL 8.0.28; espera-se que o suporte para ele seja removido em uma versão subsequente do MySQL.

* `swe7` (7bit sueco) coligações:

+ `swe7_bin`
  + `swe7_swedish_ci` (padrão)

### 12.10.3 Núcleos de Caracteres da Europa Central

O MySQL oferece suporte para conjuntos de caracteres utilizados na República Tcheca, Eslováquia, Hungria, Romênia, Eslovênia, Croácia, Polônia e Sérvia (latim).

* `cp1250` (Central Europeia do Windows): colagens

+ `cp1250_bin`
  + `cp1250_croatian_ci`
  + `cp1250_czech_cs`
  + `cp1250_general_ci` (padrão)
  + `cp1250_polish_ci`
* `cp852` (COLs da Europa Central):

+ `cp852_bin`
  + `cp852_general_ci` (padrão)
* `keybcs2` (colações para Kamenicky Czech-Slovak):

+ `keybcs2_bin`
  + `keybcs2_general_ci` (padrão)
* `latin2` (codificação da Europa Central ISO 8859-2):

+ `latin2_bin`
  + `latin2_croatian_ci`
  + `latin2_czech_cs`
  + `latin2_general_ci` (padrão)
  + `latin2_hungarian_ci`
* `macce` (coligações Mac Central Europeia):

+ `macce_bin`  
  + `macce_general_ci` (padrão)

`macce` é descontinuado no MySQL 8.0.28; espera-se que o suporte para ele seja removido em uma versão subsequente do MySQL.

### 12.10.4 Conjuntos de caracteres do sul da Europa e do Oriente Médio

Os conjuntos de caracteres do sul da Europa e do Oriente Médio suportados pelo MySQL incluem armênio, árabe, georgiano, grego, hebraico e turco.

* `armscii8` (ARMSCII-8 armênio) coligações:

+ `armscii8_bin`
  + `armscii8_general_ci` (padrão)
* `cp1256` (colagens do árabe do Windows):

+ `cp1256_bin`
  + `cp1256_general_ci` (padrão)
* `geostd8` (GEOSTD8 Georgian) colatelias:

+ `geostd8_bin`
  + `geostd8_general_ci` (padrão)
* `greek` (grego ISO 8859-7) coligações:

+ `greek_bin`
  + `greek_general_ci` (padrão)
* `hebrew` (colagens hebraicas ISO 8859-8):

+ `hebrew_bin`
  + `hebrew_general_ci` (padrão)
* `latin5` (coligações do ISO 8859-9 turco):

+ `latin5_bin`
  + `latin5_turkish_ci` (padrão)

### 12.10.5 Conjunto de Caracteres Bálticos

Os conjuntos de caracteres baltos cobrem os idiomas estoniano, letão e lituano.

* `cp1257` (Windows Baltic) colações:

+ `cp1257_bin`
  + `cp1257_general_ci` (padrão)
  + `cp1257_lithuanian_ci`
* `latin7` (coligações de ISO 8859-13 Baltic):

+ `latin7_bin`
  + `latin7_estonian_cs`
  + `latin7_general_ci` (padrão)
  + `latin7_general_cs`

### 12.10.6 Conjuntos de caracteres cirílicos

Os conjuntos de caracteres e as codificações cirílicas são para uso com os idiomas bielorusso, búlgaro, russo, ucraniano e sérvio (cirílico).

* `cp1251` (colagens de caracteres cirílicos do Windows):

+ `cp1251_bin`
  + `cp1251_bulgarian_ci`
  + `cp1251_general_ci` (padrão)
  + `cp1251_general_cs`
  + `cp1251_ukrainian_ci`
* `cp866` (COLAS russas):

+ `cp866_bin`
  + `cp866_general_ci` (padrão)
* `koi8r` (collation KOI8-R Relcom Russa):

+ `koi8r_bin`
  + `koi8r_general_ci` (padrão)
* `koi8u` (KOI8-U ucraniano) coligações:

+ `koi8u_bin`  
  + `koi8u_general_ci` (padrão)

### 12.10.7 Conjuntos de caracteres asiáticos

Os conjuntos de caracteres asiáticos que suportamos incluem chinês, japonês, coreano e tailandês. Esses conjuntos podem ser complicados. Por exemplo, os conjuntos chineses devem permitir milhares de caracteres diferentes. Consulte a Seção 12.10.7.1, “O conjunto de caracteres cp932”, para obter informações adicionais sobre os conjuntos de caracteres `cp932` e `sjis`. Consulte a Seção 12.10.7.2, “O conjunto de caracteres gb18030”, para obter informações adicionais sobre o suporte ao conjunto de caracteres do Padrão Nacional Chinês GB 18030.

Para respostas a algumas perguntas e problemas comuns relacionados ao suporte para conjuntos de caracteres asiáticos no MySQL, consulte [Seção A.11, “Perguntas frequentes do MySQL 8.0: conjuntos de caracteres chineses, japoneses e coreanos do MySQL”][(faqs-cjk.html "A.11 MySQL 8.0 FAQ: MySQL Chinese, Japanese, and Korean Character Sets")].

* `big5` (colaboração do Big5 Traditional Chinese)

+ `big5_bin`
  + `big5_chinese_ci` (padrão)
* `cp932` (SJIS para japonês do Windows):

+ `cp932_bin`
  + `cp932_japanese_ci` (padrão)
* `eucjpms` (colagens UJIS para japonês do Windows):

+ `eucjpms_bin`
  + `eucjpms_japanese_ci` (padrão)
* `euckr` (EUC-KR coreano):

+ `euckr_bin`
  + `euckr_korean_ci` (padrão)
* `gb2312` (GB2312 simplificado) coligações:

+ `gb2312_bin`
  + `gb2312_chinese_ci` (padrão)
* `gbk` (GBK simplificado) colasções:

+ `gbk_bin`
  + `gbk_chinese_ci` (padrão)
* `gb18030` (padrão nacional da China GB18030) colations:

+ `gb18030_bin`
  + `gb18030_chinese_ci` (padrão)
  + `gb18030_unicode_520_ci`
* `sjis` (colagens Shift-JIS japonês):

+ `sjis_bin`
  + `sjis_japanese_ci` (padrão)
* `tis620` (TIS620 tailandês) coligações:

+ `tis620_bin`
  + `tis620_thai_ci` (padrão)
* `ujis` (EUC-JP japonês) colateis:

+ `ujis_bin`
  + `ujis_japanese_ci` (padrão)

A ordenação `big5_chinese_ci` ordena pelo número de golpes.

#### 12.10.7.1 Conjunto de Caracteres cp932

Por que é necessário o `cp932`?

No MySQL, o conjunto de caracteres `sjis` corresponde ao conjunto de caracteres `Shift_JIS` definido pela IANA, que suporta os caracteres JIS X0201 e JIS X0208. (Veja <http://www.iana.org/assignments/character-sets>.)

No entanto, o significado de "SHIFT JIS" como termo descritivo tornou-se muito vago e muitas vezes inclui as extensões para `Shift_JIS` que são definidas por vários fornecedores.

Por exemplo, o “SHIFT JIS” usado em ambientes Windows japoneses é uma extensão da `Shift_JIS` da Microsoft e seu nome exato é `Microsoft Windows Codepage : 932` ou `cp932`. Além dos caracteres suportados pela `Shift_JIS`, a `cp932` suporta caracteres de extensão, como caracteres especiais NEC, caracteres selecionados NEC, caracteres extensos IBM selecionados e caracteres selecionados IBM.

Muitos usuários japoneses têm enfrentado problemas ao usar esses caracteres de extensão. Esses problemas decorrem dos seguintes fatores:

* O MySQL converte automaticamente os conjuntos de caracteres. * Os conjuntos de caracteres são convertidos usando Unicode (`ucs2`).

* O conjunto de caracteres `sjis` não suporta a conversão desses caracteres de extensão.

* Existem várias regras de conversão de um conjunto de caracteres chamado "SHIFT JIS" para Unicode, e alguns caracteres são convertidos para Unicode de maneira diferente, dependendo da regra de conversão. O MySQL suporta apenas uma dessas regras (descrita mais adiante).

O conjunto de caracteres MySQL `cp932` foi projetado para resolver esses problemas.

Como o MySQL suporta conversão de conjuntos de caracteres, é importante separar os conjuntos de caracteres IANA `Shift_JIS` e `cp932` em dois conjuntos de caracteres diferentes, pois eles fornecem regras de conversão diferentes.

**Como o `cp932` se diferencia do `sjis`?**

O conjunto de caracteres `cp932` difere de `sjis` nas seguintes maneiras:

* `cp932` suporta caracteres especiais NEC, NEC selecionados — caracteres extensos da IBM e caracteres selecionados da IBM.

* Alguns caracteres `cp932` têm dois pontos de código diferentes, ambos convertidos para o mesmo ponto de código Unicode. Ao converter de Unicode de volta para `cp932`, um dos pontos de código deve ser selecionado. Para essa "conversão de ida e volta", a regra recomendada pela Microsoft é usada. (Veja <http://support.microsoft.com/kb/170559/EN-US/>.)

A regra de conversão funciona da seguinte forma:

+ Se o caractere estiver nos caracteres especiais JIS X 0208 e NEC, use o ponto de código do JIS X 0208.

+ Se o caractere estiver em caracteres especiais da NEC e caracteres selecionados pela IBM, use o ponto de código dos caracteres especiais da NEC.

+ Se o caractere estiver tanto nos caracteres selecionados da IBM quanto da NEC (caracteres estendidos da IBM), use o ponto de código dos caracteres estendidos da IBM.

A tabela mostrada em <https://msdn.microsoft.com/en-us/goglobal/cc305152.aspx> fornece informações sobre os valores Unicode dos caracteres `cp932`. Para as entradas de tabela de `cp932` com caracteres sob os quais aparece um número de quatro dígitos, o número representa o codificação Unicode correspondente ([[`ucs2`]). Para as entradas de tabela com um valor de dois dígitos sublinhado, há uma faixa de valores de caracteres de `cp932` que começam com esses dois dígitos. Ao clicar em uma entrada de tabela, você é direcionado a uma página que exibe o valor Unicode para cada um dos caracteres de `cp932` que começam com esses dígitos.

Os seguintes links são de interesse especial. Eles correspondem às codificações para os seguintes conjuntos de caracteres:

+ Caracteres especiais da NEC (byte de liderança `0x87`):

    ```
    https://msdn.microsoft.com/en-us/goglobal/gg674964
    ```

+ NEC selecionada — caracteres extensos da IBM (byte principal `0xED` e `0xEE`):

    ```
    https://msdn.microsoft.com/en-us/goglobal/gg671837
    https://msdn.microsoft.com/en-us/goglobal/gg671838
    ```

+ IBM selecionou os caracteres (byte principal `0xFA`, `0xFB`, `0xFC`):

    ```
    https://msdn.microsoft.com/en-us/goglobal/gg671839
    https://msdn.microsoft.com/en-us/goglobal/gg671840
    https://msdn.microsoft.com/en-us/goglobal/gg671841
    ```

* `cp932` suporta a conversão de caracteres definidos pelo usuário em combinação com `eucjpms`, e resolve os problemas com a conversão de `sjis`/`ujis`. Para detalhes, consulte <http://www.sljfaq.org/afaq/encodings.html>.

Para alguns caracteres, a conversão para e a partir de `ucs2` é diferente para `sjis` e `cp932`. As seguintes tabelas ilustram essas diferenças.

Conversão para `ucs2`:

<table summary="sjis/cp932 values and the difference between sjis to ucs2 conversion and cp932 to ucs2 conversion."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col"><code>sjis</code>/<code>cp932</code>Valor</th> <th scope="col"><code>sjis</code> -&gt; <code>ucs2</code>Conversão</th> <th scope="col"><code>cp932</code> -&gt; <code>ucs2</code>Conversão</th> </tr></thead><tbody><tr> <th scope="row">5C</th> <td>005C</td> <td>005C</td> </tr><tr> <th scope="row">7E</th> <td>007E</td> <td>007E</td> </tr><tr> <th scope="row">815C</th> <td>2015</td> <td>2015</td> </tr><tr> <th scope="row">815F</th> <td>005C</td> <td>FF3C</td> </tr><tr> <th scope="row">8160</th> <td>301C</td> <td>FF5E</td> </tr><tr> <th scope="row">8161</th> <td>2016</td> <td>2225</td> </tr><tr> <th scope="row">817C</th> <td>2212</td> <td>FF0D</td> </tr><tr> <th scope="row">8191</th> <td>00A2</td> <td>FFE0</td> </tr><tr> <th scope="row">8192</th> <td>00A3</td> <td>FFE1</td> </tr><tr> <th scope="row">81CA</th> <td>00AC</td> <td>FFE2</td> </tr></tbody></table>

Conversão de `ucs2`:

<table summary="ucs2 values and the difference between ucs2 to sjis conversion and ucs2 to cp932 conversion."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col"><code>ucs2</code>valor</th> <th scope="col"><code>ucs2</code> -&gt; <code>sjis</code>Conversão</th> <th scope="col"><code>ucs2</code> -&gt; <code>cp932</code>Conversão</th> </tr></thead><tbody><tr> <th scope="row">005C</th> <td>815F</td> <td>5C</td> </tr><tr> <th scope="row">007E</th> <td>7E</td> <td>7E</td> </tr><tr> <th scope="row">00A2</th> <td>8191</td> <td>3F</td> </tr><tr> <th scope="row">00A3</th> <td>8192</td> <td>3F</td> </tr><tr> <th scope="row">00AC</th> <td>81CA</td> <td>3F</td> </tr><tr> <th scope="row">2015</th> <td>815C</td> <td>815C</td> </tr><tr> <th scope="row">2016</th> <td>8161</td> <td>3F</td> </tr><tr> <th scope="row">2212</th> <td>817C</td> <td>3F</td> </tr><tr> <th scope="row">2225</th> <td>3F</td> <td>8161</td> </tr><tr> <th scope="row">301C</th> <td>8160</td> <td>3F</td> </tr><tr> <th scope="row">FF0D</th> <td>3F</td> <td>817C</td> </tr><tr> <th scope="row">FF3C</th> <td>3F</td> <td>815F</td> </tr><tr> <th scope="row">FF5E</th> <td>3F</td> <td>8160</td> </tr><tr> <th scope="row">FFE0</th> <td>3F</td> <td>8191</td> </tr><tr> <th scope="row">FFE1</th> <td>3F</td> <td>8192</td> </tr><tr> <th scope="row">FFE2</th> <td>3F</td> <td>81CA</td> </tr></tbody></table>

Os usuários de qualquer conjunto de caracteres japonês devem estar cientes de que o uso de `--character-set-client-handshake` (ou `--skip-character-set-client-handshake`) tem um efeito importante. Veja a Seção 7.1.7, “Opções de comando do servidor”.

#### 12.10.7.2 O conjunto de caracteres gb18030

No MySQL, o conjunto de caracteres `gb18030` corresponde ao “Padrão Nacional Chinês GB 18030-2005: Tecnologia da informação — Conjunto de caracteres codificados chineses”, que é o conjunto de caracteres oficial da República Popular da China (RPC).

##### Características do conjunto de caracteres MySQL gb18030

* Suporta todos os pontos de código definidos pelo padrão GB 18030-2005. Os pontos de código não atribuídos nas faixas (GB+8431A439, GB+90308130) e (GB+E3329A36, GB+EF39EF39) são tratados como '`?`' (0x3F). A conversão de pontos de código não atribuídos retorna '`?`'.

* Suporta a conversão de MAYÚSCULO e MINÚSCULO para todos os pontos de código GB18030. O dobramento de caso definido pelo Unicode também é suportado (com base em `CaseFolding-6.3.0.txt`).

* Suporta a conversão de dados para e de outros conjuntos de caracteres.

* Suporta declarações SQL como `SET NAMES` (set-names.html "15.7.6.3 SET NAMES Statement").

* Suporta a comparação entre strings `gb18030` e entre as strings `gb18030` e as strings de outros conjuntos de caracteres. Há uma conversão se as strings tiverem conjuntos de caracteres diferentes. As comparações que incluem ou ignoram espaços finais também são suportadas.

* A área de uso privado (U+E000, U+F8FF) no Unicode é mapeada para `gb18030`.

* Não há mapeamento entre (U+D800, U+DFFF) e GB18030. A tentativa de conversão dos pontos de código nesta faixa retorna '`?`'.

* Se uma sequência de entrada for ilegal, um erro ou aviso é retornado. Se uma sequência ilegal for usada em `CONVERT()`, um erro é retornado. Caso contrário, um aviso é retornado.

* Para a consistência com `utf8mb3` e `utf8mb4`, o UPPER não é suportado para ligaduras.

* As pesquisas por ligaduras também correspondem a ligaduras maiúsculas ao usar a collation `gb18030_unicode_520_ci`.

* Se um caractere tiver mais de um caractere maiúsculo, o caractere maiúsculo escolhido é aquele cujo caractere minúsculo é o próprio caractere.

* O comprimento mínimo em multibytes é de 1 e o máximo é de 4. O conjunto de caracteres determina o comprimento de uma sequência usando os primeiros 1 ou 2 bytes.

##### Colorações suportadas

* `gb18030_bin`: Uma ordenação binária.
* `gb18030_chinese_ci`: A ordenação padrão, que suporta Pinyin. A ordenação de caracteres não chineses é baseada na ordem da chave de ordenação original. A chave de ordenação original é `GB(UPPER(ch))` se `UPPER(ch)` existir. Caso contrário, a chave de ordenação original é `GB(ch)`. Os caracteres chineses são ordenados de acordo com a ordenação Pinyin definida no Repositório de Dados de Local Comum Unicode (CLDR 24). Os caracteres não chineses são ordenados antes dos caracteres chineses, com exceção de `GB+FE39FE39`, que é o ponto máximo do código.

* `gb18030_unicode_520_ci`: Uma ordenação Unicode. Use esta ordenação se você precisar garantir que as ligaduras sejam ordenadas corretamente.

### 12.10.8 O Conjunto de Caracteres Binário

O conjunto de caracteres `binary` é o conjunto de caracteres para strings binárias, que são sequências de bytes. O conjunto de caracteres `binary` tem uma correção, também denominada `binary`. A comparação e ordenação são baseadas em valores numéricos de bytes, em vez de em valores de código de caracteres numéricos (que, para caracteres multibyte, diferem dos valores de bytes numéricos). Para informações sobre as diferenças entre a correção `binary` do conjunto de caracteres `binary` e as correções `_bin` dos conjuntos de caracteres não binários, consulte a Seção 12.8.5, “A correção binária em comparação com as correções _bin”.

Para o conjunto de caracteres `binary`, os conceitos de maiúsculas e acentos equivalentes não se aplicam:

* Para caracteres de único byte armazenados como strings binárias, os limites de caracteres e bytes são os mesmos, portanto, as diferenças de maiúsculas e acentos são significativas em comparações. Isso significa que a ordenação `binary` é sensível à maiúscula e sensível ao acento.

  ```
  mysql> SET NAMES 'binary';
  mysql> SELECT CHARSET('abc'), COLLATION('abc');
  +----------------+------------------+
  | CHARSET('abc') | COLLATION('abc') |
  +----------------+------------------+
  | binary         | binary           |
  +----------------+------------------+
  mysql> SELECT 'abc' = 'ABC', 'a' = 'ä';
  +---------------+------------+
  | 'abc' = 'ABC' | 'a' = 'ä'  |
  +---------------+------------+
  |             0 |          0 |
  +---------------+------------+
  ```

* Para caracteres multibyte armazenados como strings binárias, os limites de caracteres e bytes diferem. Os limites de caracteres são perdidos, portanto, as comparações que dependem deles não são significativas.

Para realizar a conversão de maiúsculas e minúsculas de uma string binária, primeiro converta-a em uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```

Para converter uma expressão de cadeia em uma cadeia binária, esses construtos são equivalentes:

```
BINARY expr
CAST(expr AS BINARY)
CONVERT(expr USING BINARY)
```

Se um valor for uma cadeia de caracteres literal, o `_binary` introducer pode ser usado para designá-lo como uma cadeia binária. Por exemplo:

```
_binary 'a'
```

O introducer `_binary` é permitido para literais hexadecimais e literais de valor de bit também, mas é desnecessário; tais literais são strings binárias por padrão.

Para mais informações sobre introdutores, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

Nota

Dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.