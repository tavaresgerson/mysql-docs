### 12.10.1 Conjuntos de caracteres Unicode

Esta seção descreve as colatações disponíveis para conjuntos de caracteres Unicode e suas propriedades diferenciadoras. Para informações gerais sobre Unicode, consulte a Seção 12.9, “Suporte Unicode”.

O MySQL suporta vários conjuntos de caracteres Unicode:

- `utf8mb4`: Uma codificação UTF-8 do conjunto de caracteres Unicode, usando de um a quatro bytes por caractere.

- `utf8mb3`: Uma codificação UTF-8 do conjunto de caracteres Unicode usando de um a três bytes por caractere. Este conjunto de caracteres é desatualizado no MySQL 8.0, e você deve usar `utf8mb4` em vez disso.

- `utf8`: Um alias para `utf8mb3`. No MySQL 8.0, este alias está desatualizado; use `utf8mb4` em vez disso. `utf8` é esperado em uma futura versão para se tornar um alias para `utf8mb4`.

- `ucs2`: A codificação UCS-2 do conjunto de caracteres Unicode usando dois bytes por caractere. Desatualizada no MySQL 8.0.28; você deve esperar que o suporte a esse conjunto de caracteres seja removido em uma futura versão.

- `utf16`: A codificação UTF-16 para o conjunto de caracteres Unicode, usando dois ou quatro bytes por caractere. Como `ucs2`, mas com uma extensão para caracteres suplementares.

- `utf16le`: A codificação UTF-16LE para o conjunto de caracteres Unicode. Como `utf16`, mas little-endian em vez de big-endian.

- `utf32`: A codificação UTF-32 para o conjunto de caracteres Unicode, usando quatro bytes por caractere.

Nota

O conjunto de caracteres `utf8mb3` está desatualizado e você deve esperar que ele seja removido em uma futura versão do MySQL. Por favor, use `utf8mb4` em vez disso. `utf8` atualmente é um alias para `utf8mb3`, mas agora está desatualizado como tal, e `utf8` deve se tornar uma referência para `utf8mb4` posteriormente. A partir do MySQL 8.0.28, `utf8mb3` também é exibido no lugar de `utf8` em colunas de tabelas do Schema de Informações e na saída de instruções SQL `SHOW`.

Para evitar ambiguidades sobre o significado de `utf8`, considere especificar explicitamente `utf8mb4` para referências de conjuntos de caracteres.

`utf8mb4`, `utf16`, `utf16le` e `utf32` suportam caracteres do Plano Multilíngue Básico (BMP) e caracteres suplementares que estão fora do BMP. `utf8mb3` e `ucs2` suportam apenas caracteres do BMP.

A maioria dos conjuntos de caracteres Unicode tem uma ordenação geral (indicada por `_general` no nome ou pela ausência de um especificador de idioma), uma ordenação binária (indicada por `_bin` no nome) e várias ordenações específicas para idiomas (indicadas por especificadores de idioma). Por exemplo, para `utf8mb4`, `utf8mb4_general_ci` e `utf8mb4_bin`, são suas ordenações gerais e binárias, e `utf8mb4_danish_ci` é uma de suas ordenações específicas para idiomas.

A maioria dos conjuntos de caracteres tem uma única ordenação binária. `utf8mb4` é uma exceção que tem duas: `utf8mb4_bin` e (a partir do MySQL 8.0.17) `utf8mb4_0900_bin`. Essas duas ordenações binárias têm o mesmo ordem de classificação, mas são distinguidas por seus atributos de alinhamento e características de peso de classificação. Veja Atributos de Alinhamento de Padrão e Pesos de Classificação de Caracteres.

O suporte de colagem para `utf16le` é limitado. As únicas colcheias disponíveis são `utf16le_general_ci` e `utf16le_bin`. Essas são semelhantes a `utf16_general_ci` e `utf16_bin`.

- Algoritmo de Cotação Unicode (UCA) (Versões)
- Atributos do Pad de Colagem
- Colagens específicas para cada idioma
- Colagens \_general\_ci versus \_unicode\_ci
- Pesos de Coleta de Caracteres
- Informações Diversas

#### Versões do Algoritmo de Cotação Unicode (UCA)

O MySQL implementa as colatações `xxx_unicode_ci` de acordo com o Algoritmo de Colatação Unicode (UCA) descrito em <http://www.unicode.org/reports/tr10/>. A colatação utiliza as chaves de peso da UCA versão 4.0.0: <http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>. As colatações `xxx_unicode_ci` têm suporte parcial apenas para o Algoritmo de Colatação Unicode. Alguns caracteres não são suportados, e as marcas de combinação não são totalmente suportadas. Isso afeta idiomas como o vietnamita, o yoruba e o navajo. Um caractere combinado é considerado diferente do mesmo caractere escrito com um único caractere Unicode em comparações de strings, e os dois caracteres são considerados ter um comprimento diferente (por exemplo, conforme retornado pela função `CHAR_LENGTH()` ou nos metadados do conjunto de resultados).

As collation de Unicode baseadas em versões superiores a 4.0.0 da UCA incluem a versão no nome da collation. Exemplos:

- `utf8mb4_unicode_520_ci` é baseado nas chaves de peso da UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>),

- `utf8mb4_0900_ai_ci` é baseado nas chaves de peso da UCA 9.0.0 (<http://www.unicode.org/Public/UCA/9.0.0/allkeys.txt>).

As funções `LOWER()` e `UPPER()` realizam a redução de maiúsculas e minúsculas de acordo com a collation de seus argumentos. Um caractere que tem versões maiúsculas e minúsculas apenas em uma versão Unicode superior a 4.0.0 é convertido por essas funções apenas se a collation do argumento usar uma versão UCA alta o suficiente.

#### Atributos do Pad de Colagem

As collation baseadas na UCA 9.0.0 e superior são mais rápidas do que as collation baseadas em versões da UCA anteriores a 9.0.0. Elas também possuem um atributo de pad `NO PAD`, em contraste com `PAD SPACE`, como usado em collation baseadas em versões da UCA anteriores a 9.0.0. Para a comparação de strings não binárias, as collation `NO PAD` tratam espaços no final das strings como qualquer outro caractere (veja o tratamento de espaços finais em comparações).

Para determinar o atributo do suporte para uma colagem, use a tabela `INFORMATION_SCHEMA` `COLLATIONS`, que possui uma coluna `PAD_ATTRIBUTE`. Por exemplo:

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

A comparação de valores de cadeia não binários (`CHAR`, `VARCHAR` e `TEXT`) que possuem uma collation `NO PAD` difere de outras collation em relação a espaços finais. Por exemplo, `'a'` e `'a '` são comparados como strings diferentes, e não como a mesma string. Isso pode ser visto usando as collation binárias para `utf8mb4`. O atributo pad para `utf8mb4_bin` é `PAD SPACE`, enquanto para `utf8mb4_0900_bin` é `NO PAD`. Consequentemente, operações que envolvem `utf8mb4_0900_bin` não adicionam espaços finais, e comparações que envolvem strings com espaços finais podem diferir nas duas collation:

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

#### Colagens específicas para cada idioma

O MySQL implementa colorações Unicode específicas para cada idioma se a ordenação baseada apenas no Algoritmo de Coloração Unicode (UCA) não funcionar bem para um idioma. As colorações específicas para cada idioma são baseadas no UCA, com regras adicionais de personalização do idioma. Exemplos dessas regras aparecem mais adiante nesta seção. Para perguntas sobre ordens de idioma específicas, o <http://unicode.org> fornece gráficos de coloração do Repositório de Dados de Local Comum (CLDR) em <http://www.unicode.org/cldr/charts/30/collation/index.html>.

Por exemplo, as collation de Unicode `utf8mb4_0900_ai_ci` não específicas de linguagem e as collation específicas de linguagem `utf8mb4_LOCALE_0900_ai_ci` têm essas características:

- A ordenação é baseada no UCA 9.0.0 e no CLDR v30, é insensível ao acento e à letra maiúscula. Essas características são indicadas por `_0900`, `_ai` e `_ci` no nome da ordenação. Exceção: `utf8mb4_la_0900_ai_ci` não é baseado no CLDR porque o Latim Clássico não está definido no CLDR.

- A ordenação funciona para todos os caracteres na faixa \[U+0, U+10FFFF].

- Se a ordenação não for específica para a língua, ela ordena todos os caracteres, incluindo caracteres suplementares, na ordem padrão (descrita a seguir). Se a ordenação for específica para a língua, ela ordena corretamente os caracteres da língua de acordo com as regras específicas da língua e os caracteres que não fazem parte da língua na ordem padrão.

- Por padrão, a ordenação de caracteres com um ponto de código listado na tabela DUCET (Tabela Padrão de Elementos de Ordenação Unicode) é feita de acordo com o valor de peso atribuído na tabela. A ordenação de caracteres que não têm um ponto de código listado na tabela DUCET é feita de acordo com seu valor de peso implícito, que é construído de acordo com a UCA.

- Para cotações não específicas de linguagem, os caracteres em sequências de contração são tratados como caracteres separados. Para cotações específicas de linguagem, as contrações podem alterar a ordem de classificação dos caracteres.

Um nome de ordenação que inclui um código de região ou nome de idioma mostrado na tabela a seguir é uma ordenação específica para o idioma. Os conjuntos de caracteres Unicode podem incluir ordenações para um ou mais desses idiomas.

**Tabela 12.3 Especificadores de idioma de comparação Unicode**

<table summary="Especificadores de idioma para colorações de conjuntos de caracteres Unicode."><thead><tr> <th>Língua</th> <th>Especificador de idioma</th> </tr></thead><tbody><tr> <td>Bósnio</td> <td>[[PH_HTML_CODE_<code>danish</code>]</td> </tr><tr> <td>Búlgaro</td> <td>[[PH_HTML_CODE_<code>danish</code>]</td> </tr><tr> <td>Chinês
Português (Brasil):</td> <td>[[PH_HTML_CODE_<code>esperanto</code>]</td> </tr><tr> <td>Latim clássico</td> <td>[[PH_HTML_CODE_<code>et</code>] ou [[PH_HTML_CODE_<code>estonian</code>]</td> </tr><tr> <td>Croata</td> <td>[[PH_HTML_CODE_<code>gl</code>] ou [[PH_HTML_CODE_<code>de_pb</code>]</td> </tr><tr> <td>Checo</td> <td>[[PH_HTML_CODE_<code>german2</code>] ou [[PH_HTML_CODE_<code>hu</code>]</td> </tr><tr> <td>Dinamarquês
Português (Brasil)</td> <td>[[PH_HTML_CODE_<code>hungarian</code>] ou [[<code>danish</code>]]</td> </tr><tr> <td>Esperanto</td> <td>[[PH_HTML_CÓDIGO_1<code>danish</code>] ou [[PH_HTML_CÓDIGO_1<code>esperanto</code>]</td> </tr><tr> <td>Estoniano
Português (Brasil)</td> <td>[[PH_HTML_CÓDIGO_1<code>et</code>] ou [[PH_HTML_CÓDIGO_1<code>estonian</code>]</td> </tr><tr> <td>Galego</td> <td>[[<code>gl</code>]]</td> </tr><tr> <td>Lista telefônica alemã</td> <td>[[PH_HTML_CÓDIGO_1<code>de_pb</code>] ou [[PH_HTML_CÓDIGO_1<code>german2</code>]</td> </tr><tr> <td>Húngaro</td> <td>[[<code>hu</code>]] ou [[<code>hungarian</code>]]</td> </tr><tr> <td>Islandês
Português (Brasil)</td> <td>[[PH_HTML_CÓDIGO_2<code>danish</code>] ou [[PH_HTML_CÓDIGO_2<code>danish</code>]</td> </tr><tr> <td>Japonês</td> <td>[[<code>zh</code><code>esperanto</code>]</td> </tr><tr> <td>Letão</td> <td>[[<code>zh</code><code>et</code>] ou [[<code>zh</code><code>estonian</code>]</td> </tr><tr> <td>Lituano</td> <td>[[<code>zh</code><code>gl</code>] ou [[<code>zh</code><code>de_pb</code>]</td> </tr><tr> <td>Mongol</td> <td>[[<code>zh</code><code>german2</code>]</td> </tr><tr> <td>Norueguês / Bokmål</td> <td>[[<code>zh</code><code>hu</code>]</td> </tr><tr> <td>Norueguês / Nynorsk</td> <td>[[<code>zh</code><code>hungarian</code>]</td> </tr><tr> <td>Persa</td> <td>[[<code>la</code><code>danish</code>]</td> </tr><tr> <td>Polonês</td> <td>[[<code>la</code><code>danish</code>] ou [[<code>la</code><code>esperanto</code>]</td> </tr><tr> <td>Romeno</td> <td>[[<code>la</code><code>et</code>] ou [[<code>la</code><code>estonian</code>]</td> </tr><tr> <td>Russo:</td> <td>[[<code>la</code><code>gl</code>]</td> </tr><tr> <td>Sérvio</td> <td>[[<code>la</code><code>de_pb</code>]</td> </tr><tr> <td>Sinhala</td> <td>[[<code>la</code><code>german2</code>]</td> </tr><tr> <td>Eslovaco</td> <td>[[<code>la</code><code>hu</code>] ou [[<code>la</code><code>hungarian</code>]</td> </tr><tr> <td>Esloveno</td> <td>[[<code>roman</code><code>danish</code>] ou [[<code>roman</code><code>danish</code>]</td> </tr><tr> <td>Espanhol moderno</td> <td>[[<code>roman</code><code>esperanto</code>] ou [[<code>roman</code><code>et</code>]</td> </tr><tr> <td>Espanhol tradicional</td> <td>[[<code>roman</code><code>estonian</code>] ou [[<code>roman</code><code>gl</code>]</td> </tr><tr> <td>Suécia</td> <td>[[<code>roman</code><code>de_pb</code>] ou [[<code>roman</code><code>german2</code>]</td> </tr><tr> <td>Turco
Português (Brasil):</td> <td>[[<code>roman</code><code>hu</code>] ou [[<code>roman</code><code>hungarian</code>]</td> </tr><tr> <td>Vietnamita</td> <td>[[<code>hr</code><code>danish</code>] ou [[<code>hr</code><code>danish</code>]</td> </tr></tbody></table>

O MySQL 8.0.30 e versões posteriores fornecem as collation `utf8mb4_bg_0900_ai_ci` e `utf8mb4_bg_0900_as_cs` para o búlgaro.

As collation de croatas são adaptadas para essas letras croatas: `Č`, `Ć`, `Dž`, `Đ`, `Lj`, `Nj`, `Š`, `Ž`.

O MySQL 8.0.30 e versões posteriores fornecem as collation `utf8mb4_sr_latn_0900_ai_ci` e `utf8mb4_sr_latn_0900_as_cs` para o sérvio e as collation `utf8mb4_bs_0900_ai_ci` e `utf8mb4_bs_0900_as_cs` para o bósnio, quando essas línguas são escritas com o alfabeto latino.

A partir do MySQL 8.0.30, o MySQL oferece colatações para as principais variedades do norueguês: para o Bokmål, você pode usar `utf8mb4_nb_0900_ai_ci` e `utf8mb4_nb_0900_as_cs`; para o Nynorsk, o MySQL agora oferece `utf8mb4_nn_0900_ai_ci` e `utf8mb4_nn_0900_as_cs`.

Para o japonês, o conjunto de caracteres `utf8mb4` inclui as collation `utf8mb4_ja_0900_as_cs` e `utf8mb4_ja_0900_as_cs_ks`. Ambas as collation são sensíveis ao acento e ao caso. `utf8mb4_ja_0900_as_cs_ks` também é sensível ao kana e distingue caracteres Katakana de caracteres Hiragana, enquanto `utf8mb4_ja_0900_as_cs` trata caracteres Katakana e Hiragana como iguais para a ordenação. Aplicações que exigem uma collation japonesa, mas não a sensibilidade ao kana, podem usar `utf8mb4_ja_0900_as_cs` para um melhor desempenho de ordenação. `utf8mb4_ja_0900_as_cs` usa três níveis de peso para a ordenação; `utf8mb4_ja_0900_as_cs_ks` usa quatro.

Para as codificações do latim clássico que não são sensíveis ao acento, `I` e `J` são considerados iguais, e `U` e `V` são considerados iguais. `I` e `J`, e `U` e `V` são considerados iguais no nível da letra base. Em outras palavras, `J` é considerado um `I` acentuado, e `U` é considerado um `V` acentuado.

O MySQL 8.0.30 e versões posteriores fornecem colatações para o idioma mongol quando escrito com caracteres cirílicos, `utf8mb4_mn_cyrl_0900_ai_ci` e `utf8mb4_mn_cyrl_0900_as_cs`.

As collationes espanholas estão disponíveis para o espanhol moderno e tradicional. Para ambos, `ñ` (tilde) é uma letra separada entre `n` e `o`. Além disso, para o espanhol tradicional, `ch` é uma letra separada entre `c` e `d`, e `ll` é uma letra separada entre `l` e `m`.

As collationes tradicionais espanholas também podem ser usadas para Astúrias e Galego. A partir do MySQL 8.0.30, o MySQL também fornece as collationes `utf8mb4_gl_0900_ai_ci` e `utf8mb4_gl_0900_as_cs` para o galego. (Estas são as mesmas collationes que `utf8mb4_es_0900_ai_ci` e `utf8mb4_es_0900_as_cs`, respectivamente.)

As collation suecas incluem regras suecas. Por exemplo, em sueco, a seguinte relação se mantém, o que não é algo esperado por um falante de alemão ou francês:

```
Ü = Y < Ö
```

#### Colagens \_general\_ci versus \_unicode\_ci

Para qualquer conjunto de caracteres Unicode, as operações realizadas usando a concordância `xxx_general_ci` são mais rápidas do que as realizadas com a concordância `xxx_unicode_ci`. Por exemplo, as comparações para a concordância `utf8mb4_general_ci` são mais rápidas, mas um pouco menos precisas, do que as comparações para `utf8mb4_unicode_ci`. A razão é que `utf8mb4_unicode_ci` suporta mapeamentos como expansões; ou seja, quando um caractere é comparado como igual a combinações de outros caracteres. Por exemplo, `ß` é igual a `ss` em alemão e em algumas outras línguas. `utf8mb4_unicode_ci` também suporta contrações e caracteres ignoráveis. `utf8mb4_general_ci` é uma concordância legada que não suporta expansões, contrações ou caracteres ignoráveis. Ela pode realizar apenas comparações um-para-um entre caracteres.

Para ilustrar melhor, as seguintes igualdades valem tanto para `utf8mb4_general_ci` quanto para `utf8mb4_unicode_ci` (para o efeito disso em comparações ou buscas, consulte a Seção 12.8.6, “Exemplos do Efeito da Cotação”):

```
Ä = A
Ö = O
Ü = U
```

Uma diferença entre as collation é que isso é verdadeiro para `utf8mb4_general_ci`:

```
ß = s
```

Embora isso seja verdade para `utf8mb4_unicode_ci`, que suporta a ordem de pedido DIN-1 alemã (também conhecida como ordem de dicionário):

```
ß = ss
```

O MySQL implementa colorações Unicode específicas para cada idioma se a ordenação com `utf8mb4_unicode_ci` não funcionar bem para um idioma. Por exemplo, `utf8mb4_unicode_ci` funciona bem para a ordem do dicionário alemão e francês, então não há necessidade de criar colorações especiais `utf8mb4`.

`utf8mb4_general_ci` também é satisfatório tanto para o alemão quanto para o francês, exceto que `ß` é igual a `s`, e não a `ss`. Se isso for aceitável para sua aplicação, você deve usar `utf8mb4_general_ci` porque é mais rápido. Se isso não for aceitável (por exemplo, se você precisar da ordem do dicionário alemão), use `utf8mb4_unicode_ci` porque é mais preciso.

Se você precisar de uma ordem em alemão DIN-2 (anúncios telefônicos), use a collation `utf8mb4_german2_ci`, que compara os seguintes conjuntos de caracteres como iguais:

```
Ä = Æ = AE
Ö = Œ = OE
Ü = UE
ß = ss
```

`utf8mb4_german2_ci` é semelhante a `latin1_german2_ci`, mas este último não compara `Æ` igual a `AE` ou `Œ` igual a `OE`. Não existe `utf8mb4_german_ci` correspondente a `latin1_german_ci` para a ordem do dicionário alemão, porque `utf8mb4_general_ci` é suficiente.

#### Pesos de Coleta de Caracteres

O peso de agregação de um personagem é determinado da seguinte forma:

- Para todas as colorações Unicode, exceto as colorações `_bin` (binárias), o MySQL realiza uma pesquisa na tabela para encontrar o peso de ordenação de um caractere.

- Para as colatações `_bin` exceto `utf8mb4_0900_bin`, o peso é baseado no ponto de código, possivelmente com bytes de zero inicial adicionados.

- Para `utf8mb4_0900_bin`, o peso são os bytes de codificação `utf8mb4`. A ordem de classificação é a mesma que para `utf8mb4_bin`, mas muito mais rápida.

Os pesos de ordenação podem ser exibidos usando a função `WEIGHT_STRING()`. (Veja a Seção 14.8, “Funções e Operadores de Cadeia de Caracteres”.) Se uma ordenação usa uma tabela de busca de peso, mas um caractere não está na tabela (por exemplo, porque é um caractere “novo”), a determinação do peso de ordenação se torna mais complexa:

- Para caracteres BMP em coligações gerais (`xxx_general_ci`), o peso é o ponto de código.

- Para caracteres BMP em coligações UCA (por exemplo, `xxx_unicode_ci` e coligações específicas de idioma), o seguinte algoritmo se aplica:

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

  O resultado é uma sequência de dois elementos de comparação, `aaaa` seguido de `bbbb`. Por exemplo:

  ```
  mysql> SELECT HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci));
  +----------------------------------------------------------+
  | HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci)) |
  +----------------------------------------------------------+
  | FBC084CF                                                 |
  +----------------------------------------------------------+
  ```

  Assim, `U+04cf CYRILLIC SMALL LETTER PALOCHKA` (`ӏ`) é, com todas as coligações UCA 4.0.0, maior que `U+04c0 CYRILLIC LETTER PALOCHKA` (`Ӏ`). Com as coligações UCA 5.2.0, todas as palochkas são ordenadas juntas.

- Para caracteres suplementares em collationais gerais, o peso é o peso para `0xfffd REPLACEMENT CHARACTER`. Para caracteres suplementares em collationais UCA 4.0.0, seu peso de collationamento é `0xfffd`. Ou seja, para o MySQL, todos os caracteres suplementares são iguais entre si e maiores que quase todos os caracteres BMP.

  Um exemplo com caracteres Deseret e `COUNT(DISTINCT)`:

  ```
  CREATE TABLE t (s1 VARCHAR(5) CHARACTER SET utf32 COLLATE utf32_unicode_ci);
  INSERT INTO t VALUES (0xfffd);   /* REPLACEMENT CHARACTER */
  INSERT INTO t VALUES (0x010412); /* DESERET CAPITAL LETTER BEE */
  INSERT INTO t VALUES (0x010413); /* DESERET CAPITAL LETTER TEE */
  SELECT COUNT(DISTINCT s1) FROM t;
  ```

  O resultado é 2 porque, nas colorações MySQL `xxx_unicode_ci`, o caractere de substituição tem um peso de `0x0dc6`, enquanto Deseret Bee e Deseret Tee têm um peso de `0xfffd`. (Se a coloração `utf32_general_ci` tivesse sido usada, o resultado seria 1, pois todos os três caracteres têm um peso de `0xfffd` nessa coloração.)

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

  `0E33` e `0E4A` são pesos primários, conforme a UCA 4.0.0. `FFFD` é o peso para KAB e também para KISH.

  A regra de que todos os caracteres suplementares são iguais entre si não é ótima, mas não se espera que cause problemas. Esses caracteres são muito raros, então é muito raro que uma string de vários caracteres consista inteiramente de caracteres suplementares. No Japão, como os caracteres suplementares são ideogramas Kanji obscuros, o usuário típico não se importa com a ordem em que estão, de qualquer forma. Se você realmente quiser que as linhas sejam ordenadas pela regra do MySQL e secundariamente pelo valor do ponto de código, é fácil:

  ```
  ORDER BY s1 COLLATE utf32_unicode_ci, s1 COLLATE utf32_bin
  ```

- Para caracteres suplementares baseados em versões UCA superiores a 4.0.0 (por exemplo, `xxx_unicode_520_ci`), os caracteres suplementares nem sempre têm o mesmo peso de correspondência. Alguns têm pesos explícitos do arquivo UCA `allkeys.txt`. Outros têm pesos calculados a partir deste algoritmo:

  ```
  aaaa= base +  (code >> 15);
  bbbb= (code & 0x7FFF) | 0x8000;
  ```

Há uma diferença entre “ordenar pelo valor do código do caractere” e “ordenar pela representação binária do caractere”, uma diferença que só aparece com `utf16_bin`, devido aos suportes.

Suponha que `utf16_bin` (a codificação binária para `utf16`) fosse uma comparação binária “byte por byte” em vez de “caractere por caractere”. Se assim fosse, a ordem dos caracteres em `utf16_bin` diferir-se-ia da ordem em `utf8mb4_bin`. Por exemplo, o seguinte gráfico mostra dois caracteres raros. O primeiro caractere está na faixa `E000`-`FFFF`, portanto, é maior que um surogado, mas menor que um suplementar. O segundo caractere é um suplementar.

```
Code point  Character                    utf8mb4      utf16
----------  ---------                    -------      -----
0FF9D       HALFWIDTH KATAKANA LETTER N  EF BE 9D     FF 9D
10384       UGARITIC LETTER DELTA        F0 90 8E 84  D8 00 DF 84
```

Os dois caracteres no gráfico estão em ordem por valor do ponto de código porque `0xff9d` < `0x10384`. E estão em ordem por valor de `utf8mb4` porque `0xef` < `0xf0`. Mas não estão em ordem por valor de `utf16`, se usarmos a comparação caracter a caractere, porque `0xff` > `0xd8`.

Portanto, a collation `utf16_bin` do MySQL não é “byte por byte”. É “por ponto de código”. Quando o MySQL vê uma codificação de caracteres suplementar em `utf16`, ele converte o valor do ponto de código do caractere e, em seguida, compara. Portanto, `utf8mb4_bin` e `utf16_bin` têm a mesma ordem. Isso está de acordo com o requisito do padrão SQL:2008 para uma collation UCS\_BASIC: “UCS\_BASIC é uma collation na qual a ordem é determinada inteiramente pelos valores escalares Unicode dos caracteres nas strings que estão sendo ordenadas. É aplicável ao repertório de caracteres UCS. Como todo repertório de caracteres é um subconjunto do repertório UCS, a collation UCS\_BASIC é potencialmente aplicável a todo conjunto de caracteres. NOTA 11: O valor escalar Unicode de um caractere é seu ponto de código tratado como um inteiro não assinado.”

Se o conjunto de caracteres for `ucs2`, a comparação é caracter a caractere, mas as cadeias de caracteres `ucs2` não devem conter surrogados, de qualquer forma.

#### Informações Diversas

As colatações `xxx_general_mysql500_ci` preservam a ordem pré-5.1.24 das colatações originais `xxx_general_ci` e permitem atualizações para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).
