### 12.10.1 Conjuntos de Caracteres Unicode

Esta seção descreve as colatações disponíveis para conjuntos de caracteres Unicode e suas propriedades diferenciadoras. Para informações gerais sobre Unicode, consulte a Seção 12.9, “Suporte Unicode”.

O MySQL suporta vários conjuntos de caracteres Unicode:

* `utf8mb4`: Uma codificação UTF-8 do conjunto de caracteres Unicode usando de um a quatro bytes por caractere.

* `utf8mb3`: Uma codificação UTF-8 do conjunto de caracteres Unicode usando de um a três bytes por caractere. Este conjunto de caracteres está desatualizado; use `utf8mb4` em vez disso.

* `utf8`: Um alias desatualizado para `utf8mb3`. Use `utf8mb4` em vez disso.

  Nota

  `utf8` é esperado que, em uma futura versão, se torne um alias para `utf8mb4`.

* `ucs2`: A codificação UCS-2 do conjunto de caracteres Unicode usando dois bytes por caractere. Desatualizado; espere que o suporte a este conjunto de caracteres seja removido em uma futura versão do MySQL.

* `utf16`: A codificação UTF-16 para o conjunto de caracteres Unicode usando dois ou quatro bytes por caractere. Como `ucs2`, mas com uma extensão para caracteres suplementares.

* `utf16le`: A codificação UTF-16LE para o conjunto de caracteres Unicode. Como `utf16`, mas little-endian em vez de big-endian.

* `utf32`: A codificação UTF-32 para o conjunto de caracteres Unicode usando quatro bytes por caractere.

Nota

O conjunto de caracteres `utf8mb3` está desatualizado e você deve esperar que ele seja removido em uma futura versão do MySQL. Use `utf8mb4` em vez disso. `utf8` é atualmente um alias para `utf8mb3`, mas agora está desatualizado como tal, e `utf8` é esperado que, posteriormente, se torne uma referência para `utf8mb4`. `utf8mb3` também é exibido no lugar de `utf8` em colunas de tabelas do Schema de Informações e na saída das declarações `SHOW` do SQL.

Para evitar ambiguidade sobre o significado de `utf8`, considere especificar `utf8mb4` explicitamente para referências de conjuntos de caracteres.

O suporte à cotação Unicode (`utf8mb4`, `utf16`, `utf16le` e `utf32`) inclui caracteres do Plano Multilíngue Básico (BMP) e caracteres suplementares que estão fora do BMP. O `utf8mb3` e o `ucs2` suportam apenas caracteres do BMP.

A maioria dos conjuntos de caracteres Unicode tem uma cotação geral (indicada por `_general` no nome ou pela ausência de um especificador de idioma), uma cotação binária (indicada por `_bin` no nome) e várias cotações específicas de idioma (indicadas por especificadores de idioma). Por exemplo, para `utf8mb4`, `utf8mb4_general_ci` e `utf8mb4_bin` são suas cotações geral e binária, e `utf8mb4_danish_ci` é uma de suas cotações específicas de idioma.

A maioria dos conjuntos de caracteres tem uma única cotação binária. O `utf8mb4` é uma exceção que tem duas: `utf8mb4_bin` e `utf8mb4_0900_bin`. Essas duas cotações binárias têm a mesma ordem de classificação, mas são distinguidas por seus atributos de alinhamento e características de peso de classificação. Veja Atributos de Alinhamento de Caracteres e Pesos de Classificação de Caracteres.

O suporte à cotação para `utf16le` é limitado. As únicas cotações disponíveis são `utf16le_general_ci` e `utf16le_bin`. Essas são semelhantes a `utf16_general_ci` e `utf16_bin`.

* Algoritmo de Cotação Unicode (UCA) Versões"
* Atributos de Alinhamento de Caracteres
* Cotações Específicas de Idioma
* Cotações \_general\_ci Versus \_unicode\_ci
* Pesos de Classificação de Caracteres
* Informações Diversas

O MySQL implementa as colatações `xxx_unicode_ci` de acordo com o Algoritmo de Colatação Unicode (UCA) descrito em <http://www.unicode.org/reports/tr10/>. A colatação utiliza as chaves de peso da UCA versão 4.0.0: <http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>. As colatações `xxx_unicode_ci` têm suporte parcial apenas para o Algoritmo de Colatação Unicode. Alguns caracteres não são suportados, e as marcas de combinação não são totalmente suportadas. Isso afeta idiomas como o vietnamita, o yoruba e o navajo. Um caractere combinado é considerado diferente do mesmo caractere escrito com um único caractere Unicode em comparações de string, e os dois caracteres são considerados ter um comprimento diferente (por exemplo, conforme retornado pela função `CHAR_LENGTH()` ou nos metadados do conjunto de resultados).

Colatações Unicode baseadas em versões UCA superiores a 4.0.0 incluem a versão no nome da colatação. Exemplos:

* `utf8mb4_unicode_520_ci` é baseado nas chaves de peso da UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>),

* `utf8mb4_0900_ai_ci` é baseado nas chaves de peso da UCA 9.0.0 (<http://www.unicode.org/Public/UCA/9.0.0/allkeys.txt>).

As funções `LOWER()` e `UPPER()` realizam a dobra de maiúsculas e minúsculas de acordo com a colatação de seu argumento. Um caractere que tem versões maiúsculas e minúsculas apenas em uma versão Unicode superior a 4.0.0 é convertido por essas funções apenas se a colatação do argumento usar uma versão UCA alta o suficiente.

#### Atributos de Padrão de Colatação

As collation baseadas na UCA 9.0.0 e superior são mais rápidas do que as collation baseadas em versões da UCA anteriores a 9.0.0. Elas também têm um atributo `NO PAD`, em contraste com `PAD SPACE`, como usado em collation baseadas em versões da UCA anteriores a 9.0.0. Para a comparação de strings não binárias, as collation `NO PAD` tratam espaços no final das strings como qualquer outro caractere (veja Tratamento de Espaços Traseiros em Comparativos).

Para determinar o atributo `PAD` para uma collation, use a tabela `COLLATIONS` do `INFORMATION_SCHEMA` que tem uma coluna `PAD_ATTRIBUTE`. Por exemplo:

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

A comparação de valores de strings não binárias (`CHAR`, `VARCHAR` e `TEXT`) que têm uma collation `NO PAD` difere de outras collation com relação a espaços traseiros. Por exemplo, `'a'` e `'a '` comparam-se como strings diferentes, não a mesma string. Isso pode ser visto usando as collation binárias para `utf8mb4`. O atributo `PAD` para `utf8mb4_bin` é `PAD SPACE`, enquanto para `utf8mb4_0900_bin` é `NO PAD`. Consequentemente, operações envolvendo `utf8mb4_0900_bin` não adicionam espaços traseiros, e comparações envolvendo strings com espaços traseiros podem diferir para as duas collation:

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

#### Collations Específicas para Línguas

O MySQL implementa collation Unicode específicas para a língua se a ordenação baseada apenas no Algoritmo de Collation Unicode (UCA) não funcionar bem para uma língua. As collation específicas para a língua são baseadas na UCA, com regras adicionais de personalização da língua. Exemplos dessas regras aparecem mais adiante nesta seção. Para perguntas sobre particularidades de ordenações de língua, <http://unicode.org> fornece gráficos de collation do Common Locale Data Repository (CLDR) em <http://www.unicode.org/cldr/charts/30/collation/index.html>.

Por exemplo, as collationes Unicode não específicas de linguagem `utf8mb4_0900_ai_ci` e `utf8mb4_LOCALE_0900_ai_ci`, cada uma com essas características:

* A collation é baseada na UCA 9.0.0 e CLDR v30, é insensível a acentos e a maiúsculas. Essas características são indicadas por `_0900`, `_ai` e `_ci` no nome da collation. Exceção: `utf8mb4_la_0900_ai_ci` não é baseada no CLDR porque o Latim Clássico não está definido no CLDR.

* A collation funciona para todos os caracteres no intervalo [U+0, U+10FFFF].

* Se a collation não for específica de linguagem, ela ordena todos os caracteres, incluindo caracteres suplementares, na ordem padrão (descrita a seguir). Se a collation for específica de linguagem, ela ordena corretamente os caracteres da língua de acordo com as regras específicas da língua, e os caracteres que não estão na língua na ordem padrão.

* Por padrão, a collation ordena caracteres com um ponto de código listado na tabela DUCET (Tabela de Elementos de Collation Unicode Padrão) de acordo com o valor de peso atribuído na tabela. A collation ordena caracteres que não têm um ponto de código listado na tabela usando seu valor de peso implícito, que é construído de acordo com a UCA.

* Para collationes não específicas de linguagem, os caracteres em sequências de contração são tratados como caracteres separados. Para collationes específicas de linguagem, as contrações podem alterar a ordem de ordenação dos caracteres.

Um nome de collation que inclui um código de localidade ou nome de idioma mostrado na tabela a seguir é uma collation específica de idioma. Os conjuntos de caracteres Unicode podem incluir collationes para um ou mais desses idiomas.

**Tabela 12.3 Especificadores de Collation de Idioma Unicode**

<table summary="Especificadores de idioma para colorações de conjuntos de caracteres Unicode."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Idioma</th> <th>Especificador de idioma</th> </tr></thead><tbody><tr> <td>Bósnio</td> <td><code class="literal">bs</code></td> </tr><tr> <td>Búlgaro</td> <td><code class="literal">bg</code></td> </tr><tr> <td>Chinês</td> <td><code class="literal">zh</code></td> </tr><tr> <td>Latim clássico</td> <td><code class="literal">la</code> ou <code class="literal">roman</code></td> </tr><tr> <td>Croata</td> <td><code class="literal">hr</code> ou <code class="literal">croatian</code></td> </tr><tr> <td>Checo</td> <td><code class="literal">cs</code> ou <code class="literal">czech</code></td> </tr><tr> <td>Dinamarquês</td> <td><code class="literal">da</code> ou <code class="literal">danish</code></td> </tr><tr> <td>Esperanto</td> <td><code class="literal">eo</code> ou <code class="literal">esperanto</code></td> </tr><tr> <td>Estoniano</td> <td><code class="literal">et</code> ou <code class="literal">estonian</code></td> </tr><tr> <td>Galego</td> <td><code class="literal">gl</code></td> </tr><tr> <td>Ordem de livro telefônico alemão</td> <td><code class="literal">de_pb</code> ou <code class="literal">german2</code></td> </tr><tr> <td>Húngaro</td> <td><code class="literal">hu</code> ou <code class="literal">hungarian</code></td> </tr><tr> <td>Islandês</td> <td><code class="literal">is</code> ou <code class="literal">icelandic</code></td> </tr><tr> <td>Japonês</td> <td><code class="literal">ja</code></td> </tr><tr> <td>Letão</td> <td><code class="literal">lv</code> ou <code class="literal">latvian</code></td> </tr><tr> <td>Lituano</td> <td><code class="literal">lt</code> ou <code class="literal">lithuanian</code></td> </tr><tr> <td>Mongol</td> <td><code class="literal">mn</code></td> </tr><tr> <td>Norueguês / Bokmål</td> <td><code class="literal">nb</code></td> </tr><tr> <td>Norueguês / Nynorsk</td> <td><code class="literal">nn</code></td> </tr><tr> <td>Persa</td> <td><code class="literal">persian</code></td> </tr><tr> <td>Polonês</td> <td><code class="literal">pl</code> ou <code class="literal">polish</code></td> </tr><tr> <td>Romeno</td> <td><code class="literal">ro</code> ou <code class="literal">romanian</code></td> </tr><tr> <td>Russo</td> <td><code class="literal">ru</code></td> </tr><tr> <td>Sérvio</td> <td><code class="literal">sr</code></td> </tr><tr> <td>Sinhala</td> <td><code class="literal">sinhala</code></td> </tr><tr> <td>Eslovaco</td> <td><code class="literal">sk</code> ou <code class="literal">slovak</code></td> </tr><tr> <td>Esloveno</td> <td><code class="literal">sl</code> ou <code class="literal">slovenian</code></td> </tr><tr> <td>Espanhol moderno</td> <td><code class="literal">es</code> ou <code class="literal">spanish</code></td> </tr><tr> <td>Espanhol tradicional</td> <td><code class="literal">es_trad</code> ou <code class="literal">spanish2</code></td> </tr><tr> <td>Sueco</td> <td><code class="literal">sv</code> ou <code class="literal">swedish</code></td> </tr><tr> <td>Turco</td> <td><code class="literal">tr</code> ou <code class="literal">turkish</code></td> </tr><tr> <td>Vietnamita</td> <td><code class="literal">vi</code> ou <code class="literal">vietnamese</code></td> </tr></tbody></table>

O MySQL fornece as collation `utf8mb4_bg_0900_ai_ci` e `utf8mb4_bg_0900_as_cs` para as letras búlgaras `Č`, `Ć`, `Dž`, `Đ`, `Lj`, `Nj`, `Š`, `Ž`.

As collation para o croata são adaptadas para essas letras croatas: `Č`, `Ć`, `Dž`, `Đ`, `Lj`, `Nj`, `Š`, `Ž`.

O MySQL fornece as collation `utf8mb4_sr_latn_0900_ai_ci` e `utf8mb4_sr_latn_0900_as_cs` para o sérvio e as collation `utf8mb4_bs_0900_ai_ci` e `utf8mb4_bs_0900_as_cs` para o bósnio, quando essas línguas são escritas com o alfabeto latino.

O MySQL fornece collation para as principais variedades do norueguês: para o Bokmål, você pode usar `utf8mb4_nb_0900_ai_ci` e `utf8mb4_nb_0900_as_cs`; para o Nynorsk, o MySQL agora fornece `utf8mb4_nn_0900_ai_ci` e `utf8mb4_nn_0900_as_cs`.

Para o japonês, o conjunto de caracteres `utf8mb4` inclui as collation `utf8mb4_ja_0900_as_cs` e `utf8mb4_ja_0900_as_cs_ks`. Ambas as collation são sensíveis ao acento e ao caso. `utf8mb4_ja_0900_as_cs_ks` também é sensível ao kana e distingue caracteres Katakana de caracteres Hiragana, enquanto `utf8mb4_ja_0900_as_cs` trata caracteres Katakana e Hiragana como iguais para a ordenação. Aplicações que exigem uma collation japonesa, mas não sensibilidade ao kana, podem usar `utf8mb4_ja_0900_as_cs` para melhor desempenho de ordenação. `utf8mb4_ja_0900_as_cs` usa três níveis de peso para a ordenação; `utf8mb4_ja_0900_as_cs_ks` usa quatro.

Para as collation de latim clássico que não são sensíveis ao acento, `I` e `J` são considerados iguais, e `U` e `V` são considerados iguais. `I` e `J`, e `U` e `V` são considerados iguais no nível da letra base. Em outras palavras, `J` é considerado um `I` acentuado, e `U` é considerado um `V` acentuado.

O MySQL fornece collation para o idioma mongol quando escrito com caracteres cirílicos, `utf8mb4_mn_cyrl_0900_ai_ci` e `utf8mb4_mn_cyrl_0900_as_cs`.

As collationes espanholas estão disponíveis para o espanhol moderno e tradicional. Para ambas, `ñ` (tilde n) é uma letra separada entre `n` e `o`. Além disso, para o espanhol tradicional, `ch` é uma letra separada entre `c` e `d`, e `ll` é uma letra separada entre `l` e `m`.

As collationes espanholas tradicionais também podem ser usadas para o asturiano e o galego. O MySQL também fornece as collationes `utf8mb4_gl_0900_ai_ci` e `utf8mb4_gl_0900_as_cs` para o galego. (Estas são as mesmas collationes que `utf8mb4_es_0900_ai_ci` e `utf8mb4_es_0900_as_cs`, respectivamente.)

As collationes suecas incluem as regras suecas. Por exemplo, em sueco, a seguinte relação se mantém, o que não é algo esperado por um falante de alemão ou francês:

```
Ü = Y < Ö
```

#### \_general\_ci Versus \_unicode\_ci Collations

Para qualquer conjunto de caracteres Unicode, as operações realizadas usando a collation `xxx_general_ci` são mais rápidas do que as para a collation `xxx_unicode_ci`. Por exemplo, as comparações para a collation `utf8mb4_general_ci` são mais rápidas, mas ligeiramente menos corretas, do que as comparações para `utf8mb4_unicode_ci`. A razão é que `utf8mb4_unicode_ci` suporta mapeamentos como expansões; ou seja, quando um caractere compara como igual a combinações de outros caracteres. Por exemplo, `ß` é igual a `ss` em alemão e em algumas outras línguas. `utf8mb4_unicode_ci` também suporta contrações e caracteres ignoráveis. `utf8mb4_general_ci` é uma collation de legado que não suporta expansões, contrações ou caracteres ignoráveis. Ela pode realizar apenas comparações um-para-um entre caracteres.

Para ilustrar ainda mais, as seguintes igualdades se mantêm tanto em `utf8mb4_general_ci` quanto em `utf8mb4_unicode_ci` (para o efeito desta em comparações ou buscas, veja a Seção 12.8.6, “Exemplos do Efeito da Collation”):

```
Ä = A
Ö = O
Ü = U
```

Uma diferença entre as collation é que isso é verdadeiro para `utf8mb4_general_ci`:

```
ß = s
```

Enquanto isso é verdadeiro para `utf8mb4_unicode_ci`, que suporta a ordem DIN-1 alemã (também conhecida como ordem do dicionário):

```
ß = ss
```

O MySQL implementa collationes Unicode específicas de idioma se a ordem com `utf8mb4_unicode_ci` não funcionar bem para um idioma. Por exemplo, `utf8mb4_unicode_ci` funciona bem para a ordem do dicionário alemão e francês, então não há necessidade de criar collationes `utf8mb4` especiais.

`utf8mb4_general_ci` também é satisfatório tanto para o alemão quanto para o francês, exceto que `ß` é igual a `s`, e não a `ss`. Se isso for aceitável para sua aplicação, você deve usar `utf8mb4_general_ci` porque é mais rápido. Se isso não for aceitável (por exemplo, se você exigir a ordem do dicionário alemão), use `utf8mb4_unicode_ci` porque é mais preciso.

Se você exigir a ordem DIN-2 alemã (livro telefônico), use a collation `utf8mb4_german2_ci`, que compara os seguintes conjuntos de caracteres como iguais:

```
Ä = Æ = AE
Ö = Œ = OE
Ü = UE
ß = ss
```

`utf8mb4_german2_ci` é semelhante a `latin1_german2_ci`, mas este último não compara `Æ` como igual a `AE` ou `Œ` como igual a `OE`. Não existe uma `utf8mb4_german_ci` correspondente a `latin1_german_ci` para a ordem do dicionário alemão porque `utf8mb4_general_ci` é suficiente.

#### Pesos de Collation de Caracteres

O peso de collation de um caractere é determinado da seguinte forma:

* Para todas as collationes Unicode exceto as collationes `_bin` (binárias), o MySQL realiza uma busca em tabela para encontrar o peso de collation de um caractere.

* Para collationes `_bin` exceto `utf8mb4_0900_bin`, o peso é baseado no ponto de código, possivelmente com bytes de zero adicionados.

* Para `utf8mb4_0900_bin`, o peso é os bytes de codificação `utf8mb4`. A ordem de classificação é a mesma que para `utf8mb4_bin`, mas muito mais rápida.

Os pesos de classificação podem ser exibidos usando a função `WEIGHT_STRING()`. (Veja a Seção 14.8, “Funções e Operadores de String”.) Se uma classificação usa uma tabela de busca de peso, mas um caractere não está na tabela (por exemplo, porque é um caractere “novo”), a determinação do peso de classificação se torna mais complexa:

* Para caracteres BMP em classificações gerais (`xxx_general_ci`), o peso é o ponto de código.

* Para caracteres BMP em classificações UCA (por exemplo, `xxx_unicode_ci` e classificações específicas de idioma), o seguinte algoritmo se aplica:

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

  O resultado é uma sequência de dois elementos de classificação, `aaaa` seguido de `bbbb`. Por exemplo:

  ```
  mysql> SELECT HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci));
  +----------------------------------------------------------+
  | HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci)) |
  +----------------------------------------------------------+
  | FBC084CF                                                 |
  +----------------------------------------------------------+
  ```

  Assim, `U+04cf CYRILLIC SMALL LETTER PALOCHKA` (`ӏ`) é, com todas as classificações UCA 4.0.0, maior que `U+04c0 CYRILLIC LETTER PALOCHKA` (`Ӏ`). Com classificações UCA 5.2.0, todas as palochkas são classificadas juntas.

* Para caracteres suplementares em classificações gerais, o peso é o peso para `0xfffd REPLACEMENT CHARACTER`. Para caracteres suplementares em classificações UCA 4.0.0, seu peso de classificação é `0xfffd`. Ou seja, para o MySQL, todos os caracteres suplementares são iguais entre si e maiores que quase todos os caracteres BMP.

Um exemplo com caracteres Deseret e `COUNT(DISTINCT)`:

```
  CREATE TABLE t (s1 VARCHAR(5) CHARACTER SET utf32 COLLATE utf32_unicode_ci);
  INSERT INTO t VALUES (0xfffd);   /* REPLACEMENT CHARACTER */
  INSERT INTO t VALUES (0x010412); /* DESERET CAPITAL LETTER BEE */
  INSERT INTO t VALUES (0x010413); /* DESERET CAPITAL LETTER TEE */
  SELECT COUNT(DISTINCT s1) FROM t;
  ```

O resultado é 2 porque, nas classificações `xxx_unicode_ci` do MySQL, o caractere de substituição tem um peso de `0x0dc6`, enquanto Deseret Bee e Deseret Tee têm ambos um peso de `0xfffd`. (Se a classificação `utf32_general_ci` fosse usada, o resultado seria 1 porque todos os três caracteres têm um peso de `0xfffd` nessa classificação.)

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

`0E33` e `0E4A` são pesos primários conforme a UCA 4.0.0. `FFFD` é o peso para KAB e também para KISH.

A regra de que todos os caracteres suplementares são iguais entre si não é ótima, mas não se espera que cause problemas. Esses caracteres são muito raros, então é muito raro que uma string de vários caracteres consista inteiramente de caracteres suplementares. No Japão, como os caracteres suplementares são ideogramas Kanji obscuros, o usuário típico não se importa com a ordem em que estão, de qualquer forma. Se você realmente quiser que as linhas sejam ordenadas pela regra do MySQL e secundariamente pelo valor do ponto de código, é fácil:

```
  ORDER BY s1 COLLATE utf32_unicode_ci, s1 COLLATE utf32_bin
  ```

* Para caracteres suplementares baseados em versões da UCA superiores a 4.0.0 (por exemplo, `xxx_unicode_520_ci`), os caracteres suplementares não têm necessariamente o mesmo peso de ordenação. Alguns têm pesos explícitos do arquivo `allkeys.txt` da UCA. Outros têm pesos calculados a partir deste algoritmo:

```
  aaaa= base +  (code >> 15);
  bbbb= (code & 0x7FFF) | 0x8000;
  ```

Há uma diferença entre “ordenar pelo valor do código do caractere” e “ordenar pelo representação binária do caractere”, uma diferença que aparece apenas com `utf16_bin`, devido aos surrogados.

Suponha que `utf16_bin` (a collation binária para `utf16`) fosse uma comparação binária “byte por byte” em vez de “caractere por caractere”. Se fosse assim, a ordem dos caracteres em `utf16_bin` diferia da ordem em `utf8mb4_bin`. Por exemplo, o seguinte gráfico mostra dois caracteres raros. O primeiro caractere está na faixa `E000`-`FFFF`, então é maior que um surrogado, mas menor que um suplementar. O segundo caractere é um suplementar.

```
Code point  Character                    utf8mb4      utf16
----------  ---------                    -------      -----
0FF9D       HALFWIDTH KATAKANA LETTER N  EF BE 9D     FF 9D
10384       UGARITIC LETTER DELTA        F0 90 8E 84  D8 00 DF 84
```

Os dois caracteres no gráfico estão em ordem por valor de ponto de código porque `0xff9d` < `0x10384`. E estão em ordem por valor de `utf8mb4` porque `0xef` < `0xf0`. Mas não estão em ordem por valor de `utf16`, se usarmos a comparação caracter a caractere, porque `0xff` > `0xd8`.

Então, a ordenação `utf16_bin` do MySQL não é “caractere a caractere”. É “por ponto de código”. Quando o MySQL vê uma codificação de caracteres suplementares em `utf16`, ele converte para o valor do ponto de código do caractere e, em seguida, compara. Portanto, `utf8mb4_bin` e `utf16_bin` têm a mesma ordem. Isso é consistente com o requisito do padrão SQL:2008 para uma ordenação UCS\_BASIC: “UCS\_BASIC é uma ordenação na qual a ordem é determinada inteiramente pelos valores escalares Unicode dos caracteres nas strings que estão sendo ordenadas. É aplicável ao repertório de caracteres UCS. Como todo repertório de caracteres é um subconjunto do repertório UCS, a ordenação UCS\_BASIC é potencialmente aplicável a todos os conjuntos de caracteres. NOTA 11: O valor escalar Unicode de um caractere é seu ponto de código tratado como um inteiro não signatário.”

Se o conjunto de caracteres for `ucs2`, a comparação é caracter a caractere, mas as strings `ucs2` não devem conter surrogados, de qualquer forma.

#### Informações Diversas

As ordenações `xxx_general_mysql500_ci` preservam a ordem pré-5.1.24 das ordenações originais `xxx_general_ci` e permitem atualizações para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).