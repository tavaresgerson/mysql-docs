### 10.10.1 Conjuntos de Caracteres Unicode

Esta seção descreve as colatações disponíveis para conjuntos de caracteres Unicode e suas propriedades diferenciadoras. Para informações gerais sobre Unicode, consulte a Seção 10.9, “Suporte Unicode”.

O MySQL suporta vários conjuntos de caracteres Unicode:

- `utf8mb4`: Uma codificação UTF-8 do conjunto de caracteres Unicode que usa de um a quatro bytes por caractere.

- `utf8mb3`: Uma codificação UTF-8 do conjunto de caracteres Unicode que usa de um a três bytes por caractere.

- `utf8`: Um alias para `utf8mb3`.

- `ucs2`: A codificação UCS-2 do conjunto de caracteres Unicode, que utiliza dois bytes por caractere.

- `utf16`: A codificação UTF-16 para o conjunto de caracteres Unicode, usando dois ou quatro bytes por caractere. Como `ucs2`, mas com uma extensão para caracteres suplementares.

- `utf16le`: A codificação UTF-16LE para o conjunto de caracteres Unicode. É semelhante ao `utf16`, mas é little-endian em vez de big-endian.

- `utf32`: A codificação UTF-32 para o conjunto de caracteres Unicode, usando quatro bytes por caractere.

O suporte para `utf8mb4`, `utf16`, `utf16le` e `utf32` inclui caracteres do Plano Multilíngue Básico (BMP) e caracteres suplementares que estão fora do BMP. O suporte para `utf8` e `ucs2` inclui apenas caracteres do BMP.

A maioria dos conjuntos de caracteres Unicode tem uma ordenação geral (indicada por `_general` no nome ou pela ausência de um especificador de idioma), uma ordenação binária (indicada por `_bin` no nome) e várias ordenações específicas de idioma (indicadas por especificadores de idioma). Por exemplo, para `utf8mb4`, `utf8mb4_general_ci` e `utf8mb4_bin` são suas ordenações gerais e binárias, e `utf8mb4_danish_ci` é uma de suas ordenações específicas de idioma.

O suporte para colagem do `utf16le` é limitado. As únicas colagens disponíveis são `utf16le_general_ci` e `utf16le_bin`. Essas são semelhantes a `utf16_general_ci` e `utf16_bin`.

- Algoritmo de Cotação Unicode (UCA) (Versões)
- Colagens específicas para cada idioma
- Colagens \_general\_ci versus \_unicode\_ci
- Pesos de Coleta de Caracteres
- Informações Diversas

#### Versões do Algoritmo de Cotação Unicode (UCA)

O MySQL implementa as colatações `xxx_unicode_ci` de acordo com o Algoritmo de Colatação Unicode (UCA) descrito em <http://www.unicode.org/reports/tr10/>. A colatação utiliza as chaves de peso da UCA versão 4.0.0: <http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>. As colatações `xxx_unicode_ci` têm suporte parcial apenas para o Algoritmo de Colatação Unicode. Alguns caracteres não são suportados, e as marcas de combinação não são totalmente suportadas. Isso afeta principalmente o vietnamita, o yoruba e algumas línguas menores, como o navajo. Um caractere combinado é considerado diferente do mesmo caractere escrito com um único caractere Unicode em comparações de strings, e os dois caracteres são considerados ter um comprimento diferente (por exemplo, conforme retornado pela função `CHAR_LENGTH()` ou nos metadados do conjunto de resultados).

As collation UCA baseadas em versões superiores a 4.0.0 incluem a versão no nome da collation. Assim, `utf8_unicode_520_ci` é baseado nas chaves de peso UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>).

As funções `LOWER()` e `UPPER()` realizam a conversão de maiúsculas e minúsculas de acordo com a collation de seus argumentos. Um caractere que tem versões maiúsculas e minúsculas apenas em uma versão Unicode superior a 4.0.0 é convertido por essas funções apenas se a collation do argumento usar uma versão UCA alta o suficiente.

#### Colagens específicas para cada idioma

O MySQL implementa colorações Unicode específicas para cada idioma se a ordenação baseada apenas no Algoritmo de Coloração Unicode (UCA) não funcionar bem para um idioma. As colorações específicas para cada idioma são baseadas no UCA, com regras adicionais de personalização do idioma. Exemplos dessas regras aparecem mais adiante nesta seção. Para perguntas sobre ordens de idioma específicas, o <http://unicode.org> fornece gráficos de coloração do Repositório de Dados de Local Comum (CLDR) em <http://www.unicode.org/cldr/charts/30/collation/index.html>.

Um nome de idioma mostrado na tabela a seguir indica uma ordenação específica para o idioma. Os conjuntos de caracteres Unicode podem incluir ordenações para um ou mais desses idiomas.

**Tabela 10.3 Especificadores de idioma de comparação Unicode**

<table summary="Especificadores de idioma para colorações de conjuntos de caracteres Unicode."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Língua</th> <th>Especificador de idioma</th> </tr></thead><tbody><tr> <td>Latim clássico</td> <td>[[PH_HTML_CODE_<code>lithuanian</code>]</td> </tr><tr> <td>Croata</td> <td>[[PH_HTML_CODE_<code>lithuanian</code>]</td> </tr><tr> <td>Checo</td> <td>[[PH_HTML_CODE_<code>polish</code>]</td> </tr><tr> <td>Dinamarquês
Português (Brasil)</td> <td>[[PH_HTML_CODE_<code>romanian</code>]</td> </tr><tr> <td>Esperanto</td> <td>[[PH_HTML_CODE_<code>sinhala</code>]</td> </tr><tr> <td>Estoniano
Português (Brasil)</td> <td>[[PH_HTML_CODE_<code>slovak</code>]</td> </tr><tr> <td>Lista telefônica alemã</td> <td>[[PH_HTML_CODE_<code>slovenian</code>]</td> </tr><tr> <td>Húngaro</td> <td>[[PH_HTML_CODE_<code>spanish</code>]</td> </tr><tr> <td>Islandês
Português (Brasil)</td> <td>[[PH_HTML_CODE_<code>spanish2</code>]</td> </tr><tr> <td>Letão</td> <td>[[PH_HTML_CODE_<code>swedish</code>]</td> </tr><tr> <td>Lituano</td> <td>[[<code>lithuanian</code>]]</td> </tr><tr> <td>Persa</td> <td>[[<code>croatian</code><code>lithuanian</code>]</td> </tr><tr> <td>Polonês</td> <td>[[<code>polish</code>]]</td> </tr><tr> <td>Romeno</td> <td>[[<code>romanian</code>]]</td> </tr><tr> <td>Sinhala</td> <td>[[<code>sinhala</code>]]</td> </tr><tr> <td>Eslovaco</td> <td>[[<code>slovak</code>]]</td> </tr><tr> <td>Esloveno</td> <td>[[<code>slovenian</code>]]</td> </tr><tr> <td>Espanhol moderno</td> <td>[[<code>spanish</code>]]</td> </tr><tr> <td>Espanhol tradicional</td> <td>[[<code>spanish2</code>]]</td> </tr><tr> <td>Suécia</td> <td>[[<code>swedish</code>]]</td> </tr><tr> <td>Turco
Português (Brasil):</td> <td>[[<code>czech</code><code>lithuanian</code>]</td> </tr><tr> <td>Vietnamita</td> <td>[[<code>czech</code><code>lithuanian</code>]</td> </tr></tbody></table>

As collation de croatas são adaptadas para essas letras croatas: `Č`, `Ć`, `Dž`, `Đ`, `Lj`, `Nj`, `Š`, `Ž`.

As collation dinamarquesas também podem ser usadas para o norueguês.

Para as codificações de latim clássico, `I` e `J` são considerados iguais, assim como `U` e `V`.

As collationes espanholas estão disponíveis para o espanhol moderno e tradicional. Para ambos, `ñ` (n-tilde) é uma letra separada entre `n` e `o`. Além disso, para o espanhol tradicional, `ch` é uma letra separada entre `c` e `d`, e `ll` é uma letra separada entre `l` e `m`.

As refeições tradicionais espanholas também podem ser usadas para Astúrias e Galiza.

As collation suecas incluem regras suecas. Por exemplo, em sueco, a seguinte relação se mantém, o que não é algo esperado por um falante de alemão ou francês:

```sql
Ü = Y < Ö
```

#### Colagens \_general\_ci versus \_unicode\_ci

Para qualquer conjunto de caracteres Unicode, as operações realizadas com a concordância `xxx_general_ci` são mais rápidas do que as realizadas com a concordância `xxx_unicode_ci`. Por exemplo, as comparações para a concordância `utf8_general_ci` são mais rápidas, mas um pouco menos precisas, do que as comparações para `utf8_unicode_ci`. A razão é que `utf8_unicode_ci` suporta mapeamentos como expansões; ou seja, quando um caractere é comparado como igual a combinações de outros caracteres. Por exemplo, `ß` é igual a `ss` em alemão e em algumas outras línguas. `utf8_unicode_ci` também suporta contrações e caracteres ignoráveis. `utf8_general_ci` é uma concordância legada que não suporta expansões, contrações ou caracteres ignoráveis. Ela pode realizar apenas comparações um-para-um entre caracteres.

Para ilustrar melhor, as seguintes igualdades valem tanto para `utf8_general_ci` quanto para `utf8_unicode_ci` (para o efeito disso em comparações ou buscas, veja a Seção 10.8.6, “Exemplos do Efeito da Cotação”):

```sql
Ä = A
Ö = O
Ü = U
```

Uma diferença entre as collation é que isso é verdadeiro para `utf8_general_ci`:

```sql
ß = s
```

Embora isso seja verdade para `utf8_unicode_ci`, que suporta a ordem DIN-1 alemã (também conhecida como ordem de dicionário):

```sql
ß = ss
```

O MySQL implementa colatações específicas para cada idioma `utf8`, caso a ordenação com `utf8_unicode_ci` não funcione bem para um idioma. Por exemplo, `utf8_unicode_ci` funciona bem para a ordem do dicionário alemão e francês, então não há necessidade de criar colatações `utf8` especiais.

`utf8_general_ci` também é satisfatório tanto para alemão quanto para francês, exceto que `ß` é igual a `s`, e não a `ss`. Se isso for aceitável para sua aplicação, você deve usar `utf8_general_ci` porque é mais rápido. Se isso não for aceitável (por exemplo, se você precisar da ordem do dicionário em alemão), use `utf8_unicode_ci` porque é mais preciso.

Se você precisar de uma ordem em alemão DIN-2 (anúncios telefônicos), use a collation `utf8_german2_ci`, que compara os seguintes conjuntos de caracteres como iguais:

```sql
Ä = Æ = AE
Ö = Œ = OE
Ü = UE
ß = ss
```

`utf8_german2_ci` é semelhante a `latin1_german2_ci`, mas este último não compara `Æ` com `AE` ou `Œ` com `OE`. Não existe `utf8_german_ci` correspondente a `latin1_german_ci` para a ordem do dicionário alemão, porque `utf8_general_ci` é suficiente.

#### Pesos de Coleta de Caracteres

O peso de agregação de um personagem é determinado da seguinte forma:

- Para todas as colorações Unicode, exceto as colorações \_bin (binária), o MySQL realiza uma pesquisa na tabela para encontrar o peso de ordenação de um caractere.

- Para as colunas `_bin`, o peso é baseado no código de ponto, possivelmente com bytes de zero inicial adicionados.

Os pesos de ordenação podem ser exibidos usando a função `WEIGHT_STRING()`. (Veja a Seção 12.8, “Funções e Operadores de String”.) Se uma ordenação usa uma tabela de busca de peso, mas um caractere não está na tabela (por exemplo, porque é um caractere “novo”), a determinação do peso de ordenação se torna mais complexa:

- Para caracteres BMP em colorações gerais (`xxx_general_ci`), o peso é o ponto de código.

- Para caracteres BMP em colatações UCA (por exemplo, `xxx_unicode_ci` e colatações específicas de idioma), o seguinte algoritmo se aplica:

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

  O resultado é uma sequência de dois elementos de comparação, `aaaa` seguido de `bbbb`. Por exemplo:

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci));
  +----------------------------------------------------------+
  | HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci)) |
  +----------------------------------------------------------+
  | FBC084CF                                                 |
  +----------------------------------------------------------+
  ```

  Assim, `U+04cf CYRILLIC SMALL LETTER PALOCHKA` é, com todas as coligações UCA 4.0.0, maior que `U+04c0 CYRILLIC LETTER PALOCHKA`. Com as coligações UCA 5.2.0, todas as palochkas são ordenadas juntas.

- Para caracteres suplementares em collationais gerais, o peso é o peso para o `0xfffd CARACTERE DE REPLICAÇÃO`. Para caracteres suplementares em collationais UCA 4.0.0, seu peso de collationação é `0xfffd`. Ou seja, para o MySQL, todos os caracteres suplementares são iguais entre si e maiores que quase todos os caracteres BMP.

  Um exemplo com caracteres Deseret e `COUNT(DISTINCT)`:

  ```sql
  CREATE TABLE t (s1 VARCHAR(5) CHARACTER SET utf32 COLLATE utf32_unicode_ci);
  INSERT INTO t VALUES (0xfffd);   /* REPLACEMENT CHARACTER */
  INSERT INTO t VALUES (0x010412); /* DESERET CAPITAL LETTER BEE */
  INSERT INTO t VALUES (0x010413); /* DESERET CAPITAL LETTER TEE */
  SELECT COUNT(DISTINCT s1) FROM t;
  ```

  O resultado é 2 porque, nas colorações MySQL `xxx_unicode_ci`, o caractere de substituição tem um peso de `0x0dc6`, enquanto Deseret Bee e Deseret Tee têm um peso de `0xfffd`. (Se tivesse sido usada a colagem `utf32_general_ci`, o resultado seria 1, porque todos os três caracteres têm um peso de `0xfffd` nessa colagem.)

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

  `0E33` e `0E4A` são pesos primários, conforme a UCA 4.0.0. `FFFD` é o peso para KAB e também para KISH.

  A regra de que todos os caracteres suplementares são iguais entre si não é ótima, mas não se espera que cause problemas. Esses caracteres são muito raros, então é muito raro que uma string de vários caracteres consista inteiramente de caracteres suplementares. No Japão, como os caracteres suplementares são ideogramas Kanji obscuros, o usuário típico não se importa com a ordem em que estão, de qualquer forma. Se você realmente quiser que as linhas sejam ordenadas pela regra do MySQL e secundariamente pelo valor do ponto de código, é fácil:

  ```sql
  ORDER BY s1 COLLATE utf32_unicode_ci, s1 COLLATE utf32_bin
  ```

- Para caracteres suplementares baseados em versões UCA superiores a 4.0.0 (por exemplo, `xxx_unicode_520_ci`), os caracteres suplementares nem sempre têm o mesmo peso de ordenação. Alguns têm pesos explícitos do arquivo `allkeys.txt` da UCA. Outros têm pesos calculados a partir deste algoritmo:

  ```sql
  aaaa= base +  (code >> 15);
  bbbb= (code & 0x7FFF) | 0x8000;
  ```

Há uma diferença entre “ordenar pelo valor do código do caractere” e “ordenar pela representação binária do caractere”, uma diferença que só aparece com `utf16_bin`, devido aos surrogados.

Suponha que `utf16_bin` (a colagem binária para `utf16`) fosse uma comparação binária “byte por byte” em vez de “caractere por caractere”. Se fosse assim, a ordem dos caracteres em `utf16_bin` seria diferente da ordem em `utf8_bin`. Por exemplo, o seguinte gráfico mostra dois caracteres raros. O primeiro caractere está na faixa `E000`-`FFFF`, então ele é maior que um surogado, mas menor que um suplementar. O segundo caractere é um suplementar.

```sql
Code point  Character                    utf8         utf16
----------  ---------                    ----         -----
0FF9D       HALFWIDTH KATAKANA LETTER N  EF BE 9D     FF 9D
10384       UGARITIC LETTER DELTA        F0 90 8E 84  D8 00 DF 84
```

Os dois caracteres no gráfico estão em ordem por valor de ponto de código porque `0xff9d` < `0x10384`. E estão em ordem por valor `utf8` porque `0xef` < `0xf0`. Mas não estão em ordem por valor `utf16`, se usarmos a comparação caracter a caractere, porque `0xff` > `0xd8`.

Portanto, a collation `utf16_bin` do MySQL não é “byte por byte”. É “por ponto de código”. Quando o MySQL vê uma codificação de caracteres suplementares em `utf16`, ele converte o valor do ponto de código do caractere e, em seguida, compara. Portanto, `utf8_bin` e `utf16_bin` têm a mesma ordem. Isso está de acordo com o requisito do padrão SQL:2008 para uma collation UCS\_BASIC: “UCS\_BASIC é uma collation na qual a ordem é determinada inteiramente pelos valores escalares Unicode dos caracteres nas strings que estão sendo ordenadas. É aplicável ao repertório de caracteres UCS. Como todo repertório de caracteres é um subconjunto do repertório UCS, a collation UCS\_BASIC é potencialmente aplicável a todo conjunto de caracteres. NOTA 11: O valor escalar Unicode de um caractere é seu ponto de código tratado como um inteiro não assinado.”

Se o conjunto de caracteres for `ucs2`, a comparação é caracter a caractere, mas as strings `ucs2` não devem conter surrogados, de qualquer forma.

#### Informações Diversas

As colorações `xxx_general_mysql500_ci` preservam a ordem pré-5.1.24 das colorações originais `xxx_general_ci` e permitem atualizações para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).
