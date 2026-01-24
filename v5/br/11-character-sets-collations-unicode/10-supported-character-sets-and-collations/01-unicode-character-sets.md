### 10.10.1 Conjuntos de Caracteres Unicode

Esta seção descreve os Collations disponíveis para conjuntos de caracteres Unicode e suas propriedades distintivas. Para informações gerais sobre Unicode, consulte a Seção 10.9, "Suporte a Unicode".

O MySQL suporta múltiplos conjuntos de caracteres Unicode:

* `utf8mb4`: Uma codificação UTF-8 do conjunto de caracteres Unicode, utilizando de um a quatro bytes por caractere.

* `utf8mb3`: Uma codificação UTF-8 do conjunto de caracteres Unicode, utilizando de um a três bytes por caractere.

* `utf8`: Um alias para `utf8mb3`.

* `ucs2`: A codificação UCS-2 do conjunto de caracteres Unicode, utilizando dois bytes por caractere.

* `utf16`: A codificação UTF-16 para o conjunto de caracteres Unicode, utilizando dois ou quatro bytes por caractere. Semelhante a `ucs2`, mas com uma extensão para caracteres suplementares.

* `utf16le`: A codificação UTF-16LE para o conjunto de caracteres Unicode. Semelhante a `utf16`, mas little-endian em vez de big-endian.

* `utf32`: A codificação UTF-32 para o conjunto de caracteres Unicode, utilizando quatro bytes por caractere.

`utf8mb4`, `utf16`, `utf16le` e `utf32` suportam caracteres do Basic Multilingual Plane (BMP) e caracteres suplementares que se encontram fora do BMP. `utf8` e `ucs2` suportam apenas caracteres BMP.

A maioria dos conjuntos de caracteres Unicode possui um Collation geral (indicado por `_general` no nome ou pela ausência de um especificador de idioma), um Collation binário (indicado por `_bin` no nome) e vários Collations específicos de idioma (indicados por especificadores de idioma). Por exemplo, para `utf8mb4`, `utf8mb4_general_ci` e `utf8mb4_bin` são seus Collations geral e binário, e `utf8mb4_danish_ci` é um de seus Collations específicos de idioma.

O suporte a Collation para `utf16le` é limitado. Os únicos Collations disponíveis são `utf16le_general_ci` e `utf16le_bin`. Estes são semelhantes a `utf16_general_ci` e `utf16_bin`.

* Versões do Unicode Collation Algorithm (UCA)
* Collations Específicos de Idioma
* Collations _general_ci Versus _unicode_ci
* Pesos de Collation de Caracteres (Character Collating Weights)
* Informações Diversas

#### Versões do Unicode Collation Algorithm (UCA)

O MySQL implementa os Collations `xxx_unicode_ci` de acordo com o Unicode Collation Algorithm (UCA), descrito em <http://www.unicode.org/reports/tr10/>. O Collation usa as chaves de peso UCA da versão 4.0.0: <http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>. Os Collations `xxx_unicode_ci` possuem apenas suporte parcial para o Unicode Collation Algorithm. Alguns caracteres não são suportados, e marcas combinatórias não são totalmente suportadas. Isso afeta primariamente o vietnamita, o iorubá e algumas línguas menores, como o navajo. Um caractere combinado é considerado diferente do mesmo caractere escrito com um único caractere Unicode em comparações de string, e os dois caracteres são considerados como tendo um comprimento diferente (por exemplo, conforme retornado pela função `CHAR_LENGTH()` ou em metadados de result set).

Collations Unicode baseados em versões UCA superiores a 4.0.0 incluem a versão no nome do Collation. Assim, `utf8_unicode_520_ci` é baseado nas chaves de peso UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>).

As funções `LOWER()` e `UPPER()` realizam a conversão de caixa (case folding) de acordo com o Collation de seu argumento. Um caractere que possui versões maiúsculas e minúsculas apenas em uma versão Unicode superior a 4.0.0 é convertido por essas funções somente se o Collation do argumento usar uma versão UCA suficientemente alta.

#### Collations Específicos de Idioma

O MySQL implementa Collations Unicode específicos de idioma se a ordenação baseada apenas no Unicode Collation Algorithm (UCA) não funcionar bem para um idioma. Os Collations específicos de idioma são baseados em UCA, com regras adicionais de adaptação (tailoring) ao idioma. Exemplos dessas regras aparecem mais adiante nesta seção. Para perguntas sobre ordenações de idiomas específicas, <http://unicode.org> fornece tabelas de Collation do Common Locale Data Repository (CLDR) em <http://www.unicode.org/cldr/charts/30/collation/index.html>.

Um nome de idioma exibido na tabela a seguir indica um Collation específico de idioma. Conjuntos de caracteres Unicode podem incluir Collations para um ou mais desses idiomas.

**Tabela 10.3 Especificadores de Idioma de Collation Unicode**

| Idioma | Especificador de Idioma |
| :--- | :--- |
| Latim Clássico | `roman` |
| Croata | `croatian` |
| Tcheco | `czech` |
| Dinamarquês | `danish` |
| Esperanto | `esperanto` |
| Estoniano | `estonian` |
| Ordem de catálogo telefônico alemão | `german2` |
| Húngaro | `hungarian` |
| Islandês | `icelandic` |
| Letão | `latvian` |
| Lituano | `lithuanian` |
| Persa | `persian` |
| Polonês | `polish` |
| Romeno | `romanian` |
| Sinhala | `sinhala` |
| Eslovaco | `slovak` |
| Esloveno | `slovenian` |
| Espanhol Moderno | `spanish` |
| Espanhol Tradicional | `spanish2` |
| Sueco | `swedish` |
| Turco | `turkish` |
| Vietnamita | `vietnamese` |

Os Collations croatas são adaptados para estas letras croatas: `Č`, `Ć`, `Dž`, `Đ`, `Lj`, `Nj`, `Š`, `Ž`.

Os Collations dinamarqueses também podem ser usados para o norueguês.

Para Collations de Latim Clássico, `I` e `J` são comparados como iguais, e `U` e `V` são comparados como iguais.

Collations espanhóis estão disponíveis para o espanhol moderno e tradicional. Para ambos, `ñ` (n-til) é uma letra separada entre `n` e `o`. Além disso, para o espanhol tradicional, `ch` é uma letra separada entre `c` e `d`, e `ll` é uma letra separada entre `l` e `m`.

Collations de Espanhol Tradicional também podem ser usados para o asturiano e o galego.

Os Collations suecos incluem regras suecas. Por exemplo, em sueco, a seguinte relação é válida, o que não é esperado por falantes de alemão ou francês:

```sql
Ü = Y < Ö
```

#### Collations _general_ci Versus _unicode_ci

Para qualquer conjunto de caracteres Unicode, as operações realizadas usando o Collation `xxx_general_ci` são mais rápidas do que as do Collation `xxx_unicode_ci`. Por exemplo, as comparações para o Collation `utf8_general_ci` são mais rápidas, mas ligeiramente menos corretas, do que as comparações para `utf8_unicode_ci`. A razão é que `utf8_unicode_ci` suporta mapeamentos como expansões; ou seja, quando um caractere é comparado como igual a combinações de outros caracteres. Por exemplo, `ß` é igual a `ss` em alemão e em alguns outros idiomas. `utf8_unicode_ci` também suporta contrações e caracteres ignoráveis. O `utf8_general_ci` é um Collation herdado que não suporta expansões, contrações ou caracteres ignoráveis. Ele pode fazer apenas comparações de um para um entre caracteres.

Para ilustrar melhor, as seguintes igualdades são válidas tanto em `utf8_general_ci` quanto em `utf8_unicode_ci` (para o efeito disso em comparações ou buscas, consulte a Seção 10.8.6, "Exemplos do Efeito do Collation"):

```sql
Ä = A
Ö = O
Ü = U
```

Uma diferença entre os Collations é que isto é verdadeiro para `utf8_general_ci`:

```sql
ß = s
```

Enquanto isto é verdadeiro para `utf8_unicode_ci`, que suporta a ordenação alemã DIN-1 (também conhecida como ordem de dicionário):

```sql
ß = ss
```

O MySQL implementa Collations `utf8` específicos de idioma se a ordenação com `utf8_unicode_ci` não funcionar bem para um idioma. Por exemplo, `utf8_unicode_ci` funciona bem para a ordem de dicionário alemã e para o francês, portanto, não há necessidade de criar Collations `utf8` especiais.

`utf8_general_ci` também é satisfatório tanto para alemão quanto para francês, exceto que `ß` é igual a `s`, e não a `ss`. Se isso for aceitável para sua aplicação, você deve usar `utf8_general_ci` porque é mais rápido. Se isso não for aceitável (por exemplo, se você precisar da ordem de dicionário alemã), use `utf8_unicode_ci` porque é mais preciso.

Se você precisar da ordenação alemã DIN-2 (catálogo telefônico), use o Collation `utf8_german2_ci`, que compara os seguintes conjuntos de caracteres como iguais:

```sql
Ä = Æ = AE
Ö = Œ = OE
Ü = UE
ß = ss
```

`utf8_german2_ci` é semelhante a `latin1_german2_ci`, mas este último não compara `Æ` como igual a `AE` ou `Œ` como igual a `OE`. Não existe um `utf8_german_ci` correspondente a `latin1_german_ci` para a ordem de dicionário alemã porque `utf8_general_ci` é suficiente.

#### Pesos de Collation de Caracteres (Character Collating Weights)

O peso de Collation de um caractere é determinado da seguinte forma:

* Para todos os Collations Unicode, exceto os Collations `_bin` (binários), o MySQL realiza uma pesquisa em tabela (table lookup) para encontrar o peso de Collation de um caractere.

* Para Collations `_bin`, o peso é baseado no Code Point, possivelmente com bytes zero iniciais adicionados.

Os pesos de Collation podem ser exibidos usando a função `WEIGHT_STRING()`. (Consulte a Seção 12.8, "Funções e Operadores de String".) Se um Collation usar uma tabela de pesquisa de peso, mas um caractere não estiver na tabela (por exemplo, porque é um caractere "novo"), a determinação do peso de Collation torna-se mais complexa:

* Para caracteres BMP em Collations gerais (`xxx_general_ci`), o peso é o Code Point.

* Para caracteres BMP em Collations UCA (por exemplo, `xxx_unicode_ci` e Collations específicos de idioma), o seguinte algoritmo se aplica:

  ```sql
  if (code >= 0x3400 && code <= 0x4DB5)
    base= 0xFB80; /* CJK Ideograph Extension */
  else if (code >= 0x4E00 && code <= 0x9FA5)
    base= 0xFB40; /* CJK Ideograph */
  else
    base= 0xFBC0; /* All other characters */
  aaaa= base +  (code >> 15);
  bbbb= (code & 0x7FFF) | 0x8000;
  ```

  O resultado é uma sequência de dois elementos de Collation, `aaaa` seguido por `bbbb`. Por exemplo:

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci));
  +----------------------------------------------------------+
  | HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci)) |
  +----------------------------------------------------------+
  | FBC084CF                                                 |
  +----------------------------------------------------------+
  ```

  Assim, `U+04cf CYRILLIC SMALL LETTER PALOCHKA` é, com todos os Collations UCA 4.0.0, maior que `U+04c0 CYRILLIC LETTER PALOCHKA`. Com Collations UCA 5.2.0, todos os palochkas são ordenados juntos.

* Para caracteres suplementares em Collations gerais, o peso é o peso para `0xfffd REPLACEMENT CHARACTER` (Caractere de Substituição). Para caracteres suplementares em Collations UCA 4.0.0, seu peso de Collation é `0xfffd`. Ou seja, para o MySQL, todos os caracteres suplementares são iguais entre si e maiores do que quase todos os caracteres BMP.

Um exemplo com caracteres Deseret e `COUNT(DISTINCT)`:

```sql
  CREATE TABLE t (s1 VARCHAR(5) CHARACTER SET utf32 COLLATE utf32_unicode_ci);
  INSERT INTO t VALUES (0xfffd);   /* REPLACEMENT CHARACTER */
  INSERT INTO t VALUES (0x010412); /* DESERET CAPITAL LETTER BEE */
  INSERT INTO t VALUES (0x010413); /* DESERET CAPITAL LETTER TEE */
  SELECT COUNT(DISTINCT s1) FROM t;
  ```

O resultado é 2 porque nos Collations `xxx_unicode_ci` do MySQL, o caractere de substituição tem um peso de `0x0dc6`, enquanto Deseret Bee e Deseret Tee têm um peso de `0xfffd`. (Se o Collation `utf32_general_ci` fosse usado, o resultado seria 1, pois todos os três caracteres têm um peso de `0xfffd` nesse Collation.)

Um exemplo com caracteres cuneiformes e `WEIGHT_STRING()`:

```sql
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

```sql
  0E33 FFFD FFFD 0E4A
  ```

`0E33` e `0E4A` são pesos primários conforme no UCA 4.0.0. `FFFD` é o peso para KAB e também para KISH.

A regra de que todos os caracteres suplementares são iguais entre si não é ideal, mas não é esperado que cause problemas. Esses caracteres são muito raros, então é muito incomum que uma string de múltiplos caracteres consista inteiramente em caracteres suplementares. No Japão, como os caracteres suplementares são ideogramas Kanji obscuros, o usuário típico não se importa com a ordem em que estão, de qualquer forma. Se você realmente deseja que as linhas sejam ordenadas pela regra do MySQL e secundariamente pelo valor do Code Point, é fácil:

```sql
  ORDER BY s1 COLLATE utf32_unicode_ci, s1 COLLATE utf32_bin
  ```

* Para caracteres suplementares baseados em versões UCA superiores a 4.0.0 (por exemplo, `xxx_unicode_520_ci`), os caracteres suplementares não têm necessariamente o mesmo peso de Collation. Alguns têm pesos explícitos do arquivo `allkeys.txt` do UCA. Outros têm pesos calculados a partir deste algoritmo:

  ```sql
  aaaa= base +  (code >> 15);
  bbbb= (code & 0x7FFF) | 0x8000;
  ```

Existe uma diferença entre "ordenar pelo valor de Code do caractere" e "ordenar pela representação binária do caractere", uma diferença que aparece apenas com `utf16_bin`, por causa dos surrogates.

Suponha que `utf16_bin` (o Collation binário para `utf16`) fosse uma comparação binária "byte a byte" em vez de "caractere por caractere". Se fosse assim, a ordem dos caracteres em `utf16_bin` diferiria da ordem em `utf8_bin`. Por exemplo, a tabela a seguir mostra dois caracteres raros. O primeiro caractere está no intervalo `E000`-`FFFF`, então é maior que um surrogate, mas menor que um suplementar. O segundo caractere é um suplementar.

```sql
Code point  Character                    utf8         utf16
----------  ---------                    ----         -----
0FF9D       HALFWIDTH KATAKANA LETTER N  EF BE 9D     FF 9D
10384       UGARITIC LETTER DELTA        F0 90 8E 84  D8 00 DF 84
```

Os dois caracteres na tabela estão em ordem pelo valor do Code Point porque `0xff9d` < `0x10384`. E eles estão em ordem pelo valor `utf8` porque `0xef` < `0xf0`. Mas eles não estão em ordem pelo valor `utf16`, se usarmos a comparação byte a byte, porque `0xff` > `0xd8`.

Portanto, o Collation `utf16_bin` do MySQL não é "byte a byte". É "por Code Point". Quando o MySQL vê uma codificação de caractere suplementar em `utf16`, ele converte para o valor do Code Point do caractere e então compara. Consequentemente, `utf8_bin` e `utf16_bin` têm a mesma ordenação. Isso é consistente com o requisito da norma SQL:2008 para um Collation UCS_BASIC: “UCS_BASIC é um Collation no qual a ordenação é determinada inteiramente pelos valores escalares Unicode dos caracteres nas strings que estão sendo ordenadas. É aplicável ao repertório de caracteres UCS. Visto que todo repertório de caracteres é um subconjunto do repertório UCS, o Collation UCS_BASIC é potencialmente aplicável a todo conjunto de caracteres. NOTA 11: O valor escalar Unicode de um caractere é seu Code Point tratado como um inteiro sem sinal."

Se o conjunto de caracteres for `ucs2`, a comparação é byte a byte, mas as strings `ucs2` não devem conter surrogates de qualquer forma.

#### Informações Diversas

Os Collations `xxx_general_mysql500_ci` preservam a ordenação pré-5.1.24 dos Collations `xxx_general_ci` originais e permitem upgrades para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).