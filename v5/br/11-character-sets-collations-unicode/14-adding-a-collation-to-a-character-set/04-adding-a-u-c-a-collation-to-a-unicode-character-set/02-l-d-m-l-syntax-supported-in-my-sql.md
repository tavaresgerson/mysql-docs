#### 10.14.4.2 Sintaxe LDML Suportada no MySQL

Esta seção descreve a sintaxe LDML que o MySQL reconhece. Este é um subconjunto da sintaxe descrita na especificação LDML disponível em <http://www.unicode.org/reports/tr35/>, que deve ser consultada para mais informações. O MySQL reconhece um subconjunto grande o suficiente da sintaxe para que, em muitos casos, seja possível baixar uma definição de Collation do Unicode Common Locale Data Repository e colar a parte relevante (ou seja, a parte entre as tags `<rules>` e `</rules>`) no arquivo `Index.xml` do MySQL. As regras descritas aqui são todas suportadas, exceto que a ordenação de caracteres ocorre apenas no nível primary. As regras que especificam diferenças nos níveis de ordenação secondary ou superiores são reconhecidas (e, portanto, podem ser incluídas nas definições de Collation), mas são tratadas como igualdade no nível primary.

O servidor MySQL gera diagnósticos quando encontra problemas ao analisar o arquivo `Index.xml`. Veja Seção 10.14.4.3, “Diagnósticos Durante a Análise de Index.xml”.

**Representação de Caracteres**

Os caracteres nomeados nas regras LDML podem ser escritos literalmente ou no formato `\unnnn`, onde *`nnnn`* é o valor hexadecimal do Unicode Code Point. Por exemplo, `A` e `á` podem ser escritos literalmente ou como `\u0041` e `\u00E1`. Dentro de valores hexadecimais, os dígitos de `A` a `F` não diferenciam maiúsculas de minúsculas; `\u00E1` e `\u00e1` são equivalentes. Para Collations UCA 4.0.0, a notação hexadecimal pode ser usada apenas para caracteres no Basic Multilingual Plane (BMP), não para caracteres fora do range BMP de `0000` a `FFFF`. Para Collations UCA 5.2.0, a notação hexadecimal pode ser usada para qualquer caractere.

O arquivo `Index.xml` em si deve ser escrito usando codificação UTF-8.

**Regras de Sintaxe**

LDML possui Reset Rules e Shift Rules para especificar a ordenação de caracteres. As ordenações são fornecidas como um conjunto de regras que começam com uma Reset Rule que estabelece um Anchor Point, seguida por Shift Rules que indicam como os caracteres se ordenam em relação ao Anchor Point.

* Uma `<reset>` rule não especifica nenhuma ordenação por si só. Em vez disso, ela "reseta" a ordenação para Shift Rules subsequentes, fazendo com que sejam consideradas em relação a um determinado caractere. Qualquer uma das regras a seguir reseta as Shift Rules subsequentes para serem consideradas em relação à letra `'A'`:

  ```sql
  <reset>A</reset><reset>\u0041</reset>
  ```

* As Shift Rules `<p>`, `<s>` e `<t>` definem as diferenças primary, secondary e tertiary de um caractere em relação a outro caractere:

  + Use diferenças primary para distinguir letras separadas.

  + Use diferenças secondary para distinguir variações de acentuação (accent variations).

  + Use diferenças tertiary para distinguir variações de Case (maiúsculas/minúsculas).

  Qualquer uma destas regras especifica uma Primary Shift Rule para o caractere `'G'`:

  ```sql
  <p>G</p><p>\u0047</p>
  ```

* A Shift Rule `<i>` indica que um caractere se ordena de forma idêntica a outro. As regras a seguir fazem com que `'b'` se ordene da mesma forma que `'a'`:

  ```sql
  <reset>a</reset><i>b</i>
  ```

* A sintaxe de Shift abreviada especifica múltiplas Shift Rules usando um único par de tags. A tabela a seguir mostra a correspondência entre regras de sintaxe abreviada e as regras não abreviadas equivalentes.

  **Tabela 10.5 Sintaxe Abreviada de Shift**

  <table summary="Sintaxe de shift abreviada e as regras de sintaxe não abreviada correspondentes."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Sintaxe Abreviada</th> <th>Sintaxe Não Abreviada</th> </tr></thead><tbody><tr> <td><code>&lt;pc&gt;xyz&lt;/pc&gt;</code></td> <td><code>&lt;p&gt;x&lt;/p&gt;&lt;p&gt;y&lt;/p&gt;&lt;p&gt;z&lt;/p&gt;</code></td> </tr><tr> <td><code>&lt;sc&gt;xyz&lt;/sc&gt;</code></td> <td><code>&lt;s&gt;x&lt;/s&gt;&lt;s&gt;y&lt;/s&gt;&lt;s&gt;z&lt;/s&gt;</code></td> </tr><tr> <td><code>&lt;tc&gt;xyz&lt;/tc&gt;</code></td> <td><code>&lt;t&gt;x&lt;/t&gt;&lt;t&gt;y&lt;/t&gt;&lt;t&gt;z&lt;/t&gt;</code></td> </tr><tr> <td><code>&lt;ic&gt;xyz&lt;/ic&gt;</code></td> <td><code>&lt;i&gt;x&lt;/i&gt;&lt;i&gt;y&lt;/i&gt;&lt;i&gt;z&lt;/i&gt;</code></td> </tr></tbody></table>

* Uma Expansion (Expansão) é uma Reset Rule que estabelece um Anchor Point para uma sequência de múltiplos caracteres. O MySQL suporta Expansions de 2 a 6 caracteres. As regras a seguir colocam `'z'` como maior no nível primary do que a sequência de três caracteres `'abc'`:

  ```sql
  <reset>abc</reset><p>z</p>
  ```

* Uma Contraction (Contração) é uma Shift Rule que ordena uma sequência de múltiplos caracteres. O MySQL suporta Contractions de 2 a 6 caracteres. As regras a seguir colocam a sequência de três caracteres `'xyz'` como maior no nível primary do que `'a'`:

  ```sql
  <reset>a</reset><p>xyz</p>
  ```

* Long Expansions e Long Contractions podem ser usadas juntas. Estas regras colocam a sequência de três caracteres `'xyz'` como maior no nível primary do que a sequência de três caracteres `'abc'`:

  ```sql
  <reset>abc</reset><p>xyz</p>
  ```

* A sintaxe de Normal Expansion usa `<x>` mais elementos `<extend>` para especificar uma Expansion. As regras a seguir colocam o caractere `'k'` como maior no nível secondary do que a sequência `'ch'`. Ou seja, `'k'` se comporta como se expandisse para um caractere depois de `'c'` seguido por `'h'`:

  ```sql
  <reset>c</reset><x><s>k</s><extend>h</extend></x>
  ```

  Esta sintaxe permite sequências longas. Estas regras ordenam a sequência `'ccs'` como maior no nível tertiary do que a sequência `'cscs'`:

  ```sql
  <reset>cs</reset><x><t>ccs</t><extend>cs</extend></x>
  ```

  A especificação LDML descreve a sintaxe de Normal Expansion como "complicada" (tricky). Consulte essa especificação para detalhes.

* A sintaxe de Previous Context (Contexto Anterior) usa `<x>` mais elementos `<context>` para especificar que o contexto antes de um caractere afeta como ele se ordena. As regras a seguir colocam `'-'` como maior no nível secondary do que `'a'`, mas somente quando `'-'` ocorre após `'b'`:

  ```sql
  <reset>a</reset><x><context>b</context><s>-</s></x>
  ```

* A sintaxe de Previous Context pode incluir o elemento `<extend>`. Estas regras colocam `'def'` como maior no nível primary do que `'aghi'`, mas somente quando `'def'` vem depois de `'abc'`:

  ```sql
  <reset>a</reset><x><context>abc</context><p>def</p><extend>ghi</extend></x>
  ```

* Reset Rules permitem um Attribute `before`. Normalmente, Shift Rules após uma Reset Rule indicam caracteres que se ordenam após o caractere de reset. Shift Rules após uma Reset Rule que tem o Attribute `before` indicam caracteres que se ordenam antes do caractere de reset. As regras a seguir colocam o caractere `'b'` imediatamente antes de `'a'` no nível primary:

  ```sql
  <reset before="primary">a</reset><p>b</p>
  ```

  Os valores permissíveis do Attribute `before` especificam o nível de ordenação por nome ou pelo valor numérico equivalente:

  ```sql
  <reset before="primary"><reset before="1"><reset before="secondary"><reset before="2"><reset before="tertiary"><reset before="3">
  ```

* Uma Reset Rule pode nomear uma Logical Reset Position (Posição de Reset Lógica) em vez de um caractere literal:

  ```sql
  <first_tertiary_ignorable/><last_tertiary_ignorable/><first_secondary_ignorable/><last_secondary_ignorable/><first_primary_ignorable/><last_primary_ignorable/><first_variable/><last_variable/><first_non_ignorable/><last_non_ignorable/><first_trailing/><last_trailing/>
  ```

  Estas regras colocam `'z'` como maior no nível primary do que caracteres não-ignoráveis que possuem uma entrada Default Unicode Collation Element Table (DUCET) e que não são CJK:

  ```sql
  <reset><last_non_ignorable/></reset><p>z</p>
  ```

  As Posições Lógicas têm os Code Points mostrados na tabela a seguir.

  **Tabela 10.6 Code Points de Posição de Reset Lógica**

  <table summary="Posições lógicas e Code Points Unicode 4.0.0 e Unicode 5.2.0."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Posição Lógica</th> <th>Code Point Unicode 4.0.0</th> <th>Code Point Unicode 5.2.0</th> </tr></thead><tbody><tr> <th><code>&lt;first_non_ignorable/&gt;</code></th> <td>U+02D0</td> <td>U+02D0</td> </tr><tr> <th><code>&lt;last_non_ignorable/&gt;</code></th> <td>U+A48C</td> <td>U+1342E</td> </tr><tr> <th><code>&lt;first_primary_ignorable/&gt;</code></th> <td>U+0332</td> <td>U+0332</td> </tr><tr> <th><code>&lt;last_primary_ignorable/&gt;</code></th> <td>U+20EA</td> <td>U+101FD</td> </tr><tr> <th><code>&lt;first_secondary_ignorable/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;last_secondary_ignorable/&gt;</code></th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th><code>&lt;first_tertiary_ignorable/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;last_tertiary_ignorable/&gt;</code></th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th><code>&lt;first_trailing/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;last_trailing/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;first_variable/&gt;</code></th> <td>U+0009</td> <td>U+0009</td> </tr><tr> <th><code>&lt;last_variable/&gt;</code></th> <td>U+2183</td> <td>U+1D371</td> </tr></tbody></table>

* O elemento `<collation>` permite um Attribute `shift-after-method` que afeta o cálculo do peso do caractere para Shift Rules. O Attribute tem estes valores permitidos:

  + `simple`: Calcula os pesos dos caracteres como para Reset Rules que não possuem um Attribute `before`. Este é o default se o Attribute não for fornecido.

  + `expand`: Usa Expansions para shifts após Reset Rules.

  Suponha que `'0'` e `'1'` tenham pesos de `0E29` e `0E2A` e queiramos colocar todas as letras Latinas básicas entre `'0'` e `'1'`:

  ```sql
  <reset>0</reset><pc>abcdefghijklmnopqrstuvwxyz</pc>
  ```

  Para o modo de Shift `simple`, os pesos são calculados da seguinte forma:

  ```sql
  'a' has weight 0E29+1
  'b' has weight 0E29+2
  'c' has weight 0E29+3
  ...
  ```

  No entanto, não há posições vagas suficientes para colocar 26 caracteres entre `'0'` e `'1'`. O resultado é que dígitos e letras são misturados.

  Para resolver isso, use `shift-after-method="expand"`. Então os pesos são calculados assim:

  ```sql
  'a' has weight [0E29][233D+1]
  'b' has weight [0E29][233D+2]
  'c' has weight [0E29][233D+3]
  ...
  ```

  `233D` é o peso UCA 4.0.0 para o caractere `0xA48C`, que é o último caractere não-ignorável (uma espécie de caractere maior na Collation, excluindo CJK). O UCA 5.2.0 é semelhante, mas usa `3ACA`, para o caractere `0x1342E`.

**Extensões LDML Específicas do MySQL**

Uma extensão às regras LDML permite que o elemento `<collation>` inclua um Attribute `version` opcional nas tags `<collation>` para indicar a versão UCA na qual a Collation se baseia. Se o Attribute `version` for omitido, seu valor default é `4.0.0`. Por exemplo, esta especificação indica uma Collation baseada no UCA 5.2.0:

```sql
<collation id="nnn" name="utf8_xxx_ci" version="5.2.0">
...
</collation>
```