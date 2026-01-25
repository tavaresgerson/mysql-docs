#### 10.14.4.2 Sintaxe LDML Suportada no MySQL

Esta seção descreve a sintaxe LDML que o MySQL reconhece. Este é um subconjunto da sintaxe descrita na especificação LDML disponível em <http://www.unicode.org/reports/tr35/>, que deve ser consultada para mais informações. O MySQL reconhece um subconjunto da sintaxe grande o suficiente para que, em muitos casos, seja possível baixar uma definição de collation do Unicode Common Locale Data Repository e colar a parte relevante (ou seja, a parte entre as tags `<rules>` e `</rules>`) no arquivo `Index.xml` do MySQL. Todas as rules descritas aqui são suportadas, exceto pelo fato de que a classificação de caracteres (character sorting) ocorre apenas no nível primary. Rules que especificam diferenças nos níveis de classificação secondary ou superior são reconhecidas (e, portanto, podem ser incluídas nas definições de collation), mas são tratadas como igualdade no nível primary.

O servidor MySQL gera diagnósticos quando encontra problemas ao fazer o parsing do arquivo `Index.xml`. Consulte a Seção 10.14.4.3, “Diagnostics During Index.xml Parsing”.

**Representação de Caracteres**

Caracteres nomeados nas rules LDML podem ser escritos literalmente ou no formato `\unnnn`, onde *`nnnn`* é o valor hexadecimal do Unicode code point. Por exemplo, `A` e `á` podem ser escritos literalmente ou como `\u0041` e `\u00E1`. Dentro de valores hexadecimais, os dígitos de `A` a `F` não diferenciam maiúsculas e minúsculas (não são case-sensitive); `\u00E1` e `\u00e1` são equivalentes. Para collations UCA 4.0.0, a notação hexadecimal pode ser usada apenas para caracteres no Basic Multilingual Plane (BMP), não para caracteres fora do range BMP de `0000` a `FFFF`. Para collations UCA 5.2.0, a notação hexadecimal pode ser usada para qualquer caractere.

O arquivo `Index.xml` em si deve ser escrito usando a codificação UTF-8.

**Syntax Rules**

O LDML possui *reset rules* e *shift rules* para especificar a ordenação de caracteres. As ordenações são fornecidas como um conjunto de rules que começam com uma reset rule que estabelece um ponto de ancoragem, seguida por shift rules que indicam como os caracteres se classificam (sort) em relação ao ponto de ancoragem.

* Uma `<reset>` rule não especifica nenhuma ordenação por si só. Em vez disso, ela "reseta" a ordenação para que as shift rules subsequentes sejam consideradas em relação a um determinado caractere. Qualquer uma das seguintes rules reseta as shift rules subsequentes para serem consideradas em relação à letra `'A'`:

  ```sql
  <reset>A</reset>

  <reset>\u0041</reset>
  ```

* As shift rules `<p>`, `<s>` e `<t>` definem as diferenças primary, secondary e tertiary de um caractere em relação a outro caractere:

  + Use diferenças primary para distinguir letras separadas.

  + Use diferenças secondary para distinguir variações de acentuação.

  + Use diferenças tertiary para distinguir variações de caixa de letra (lettercase).

  Qualquer uma dessas rules especifica uma primary shift rule para o caractere `'G'`:

  ```sql
  <p>G</p>

  <p>\u0047</p>
  ```

* A shift rule `<i>` indica que um caractere se classifica (sorts) de forma idêntica a outro. As seguintes rules fazem com que `'b'` se classifique da mesma forma que `'a'`:

  ```sql
  <reset>a</reset>
  <i>b</i>
  ```

* A sintaxe de shift abreviada especifica múltiplas shift rules usando um único par de tags. A tabela a seguir mostra a correspondência entre as rules de sintaxe abreviada e as rules não abreviadas equivalentes.

  **Tabela 10.5 Sintaxe de Shift Abreviada**

  <table summary="Sintaxe de shift abreviada e as rules correspondentes não abreviadas."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Sintaxe Abreviada</th> <th>Sintaxe Não Abreviada</th> </tr></thead><tbody><tr> <td><code>&lt;pc&gt;xyz&lt;/pc&gt;</code></td> <td><code>&lt;p&gt;x&lt;/p&gt;&lt;p&gt;y&lt;/p&gt;&lt;p&gt;z&lt;/p&gt;</code></td> </tr><tr> <td><code>&lt;sc&gt;xyz&lt;/sc&gt;</code></td> <td><code>&lt;s&gt;x&lt;/s&gt;&lt;s&gt;y&lt;/s&gt;&lt;s&gt;z&lt;/s&gt;</code></td> </tr><tr> <td><code>&lt;tc&gt;xyz&lt;/tc&gt;</code></td> <td><code>&lt;t&gt;x&lt;/t&gt;&lt;t&gt;y&lt;/t&gt;&lt;t&gt;z&lt;/t&gt;</code></td> </tr><tr> <td><code>&lt;ic&gt;xyz&lt;/ic&gt;</code></td> <td><code>&lt;i&gt;x&lt;/i&gt;&lt;i&gt;y&lt;/i&gt;&lt;i&gt;z&lt;/i&gt;</code></td> </tr></tbody></table>

* Uma *expansion* (expansão) é uma reset rule que estabelece um ponto de ancoragem para uma sequência de múltiplos caracteres. O MySQL suporta expansions de 2 a 6 caracteres de comprimento. As seguintes rules colocam `'z'` como maior no nível primary do que a sequência de três caracteres `'abc'`:

  ```sql
  <reset>abc</reset>
  <p>z</p>
  ```

* Uma *contraction* (contração) é uma shift rule que classifica uma sequência de múltiplos caracteres. O MySQL suporta contractions de 2 a 6 caracteres de comprimento. As seguintes rules colocam a sequência de três caracteres `'xyz'` como maior no nível primary do que `'a'`:

  ```sql
  <reset>a</reset>
  <p>xyz</p>
  ```

* Long expansions e long contractions podem ser usadas em conjunto. Estas rules colocam a sequência de três caracteres `'xyz'` como maior no nível primary do que a sequência de três caracteres `'abc'`:

  ```sql
  <reset>abc</reset>
  <p>xyz</p>
  ```

* A sintaxe de expansion normal usa elementos `<x>` mais `<extend>` para especificar uma expansion. As seguintes rules colocam o caractere `'k'` como maior no nível secondary do que a sequência `'ch'`. Ou seja, `'k'` se comporta como se fosse expandido para um caractere depois de `'c'` seguido por `'h'`:

  ```sql
  <reset>c</reset>
  <x><s>k</s><extend>h</extend></x>
  ```

  Esta sintaxe permite sequências longas. Estas rules classificam a sequência `'ccs'` como maior no nível tertiary do que a sequência `'cscs'`:

  ```sql
  <reset>cs</reset>
  <x><t>ccs</t><extend>cs</extend></x>
  ```

  A especificação LDML descreve a sintaxe de expansion normal como "complicada" (*"tricky"*). Consulte essa especificação para obter detalhes.

* A sintaxe de contexto anterior usa elementos `<x>` mais `<context>` para especificar que o contexto antes de um caractere afeta como ele se classifica. As seguintes rules colocam `'-'` como maior no nível secondary do que `'a'`, mas apenas quando `'-'` ocorre depois de `'b'`:

  ```sql
  <reset>a</reset>
  <x><context>b</context><s>-</s></x>
  ```

* A sintaxe de contexto anterior pode incluir o elemento `<extend>`. Estas rules colocam `'def'` como maior no nível primary do que `'aghi'`, mas apenas quando `'def'` vem depois de `'abc'`:

  ```sql
  <reset>a</reset>
  <x><context>abc</context><p>def</p><extend>ghi</extend></x>
  ```

* Reset rules permitem um atributo `before`. Normalmente, shift rules após uma reset rule indicam caracteres que se classificam após o caractere de reset. Shift rules após uma reset rule que possui o atributo `before` indicam caracteres que se classificam antes do caractere de reset. As seguintes rules colocam o caractere `'b'` imediatamente antes de `'a'` no nível primary:

  ```sql
  <reset before="primary">a</reset>
  <p>b</p>
  ```

  Valores permissíveis para o atributo `before` especificam o nível de classificação (sort level) por nome ou pelo valor numérico equivalente:

  ```sql
  <reset before="primary">
  <reset before="1">

  <reset before="secondary">
  <reset before="2">

  <reset before="tertiary">
  <reset before="3">
  ```

* Uma reset rule pode nomear uma posição de reset lógica em vez de um caractere literal:

  ```sql
  <first_tertiary_ignorable/>
  <last_tertiary_ignorable/>
  <first_secondary_ignorable/>
  <last_secondary_ignorable/>
  <first_primary_ignorable/>
  <last_primary_ignorable/>
  <first_variable/>
  <last_variable/>
  <first_non_ignorable/>
  <last_non_ignorable/>
  <first_trailing/>
  <last_trailing/>
  ```

  Estas rules colocam `'z'` como maior no nível primary do que caracteres não ignoráveis que têm uma entrada na Default Unicode Collation Element Table (DUCET) e que não são CJK:

  ```sql
  <reset><last_non_ignorable/></reset>
  <p>z</p>
  ```

  As posições lógicas têm os code points mostrados na tabela a seguir.

  **Tabela 10.6 Code Points de Posição de Reset Lógica**

  <table summary="Posições lógicas e Code Points Unicode 4.0.0 e Unicode 5.2.0."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Posição Lógica</th> <th>Code Point Unicode 4.0.0</th> <th>Code Point Unicode 5.2.0</th> </tr></thead><tbody><tr> <th><code>&lt;first_non_ignorable/&gt;</code></th> <td>U+02D0</td> <td>U+02D0</td> </tr><tr> <th><code>&lt;last_non_ignorable/&gt;</code></th> <td>U+A48C</td> <td>U+1342E</td> </tr><tr> <th><code>&lt;first_primary_ignorable/&gt;</code></th> <td>U+0332</td> <td>U+0332</td> </tr><tr> <th><code>&lt;last_primary_ignorable/&gt;</code></th> <td>U+20EA</td> <td>U+101FD</td> </tr><tr> <th><code>&lt;first_secondary_ignorable/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;last_secondary_ignorable/&gt;</code></th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th><code>&lt;first_tertiary_ignorable/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;last_tertiary_ignorable/&gt;</code></th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th><code>&lt;first_trailing/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;last_trailing/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;first_variable/&gt;</code></th> <td>U+0009</td> <td>U+0009</td> </tr><tr> <th><code>&lt;last_variable/&gt;</code></th> <td>U+2183</td> <td>U+1D371</td> </tr></tbody></table>

* O elemento `<collation>` permite um atributo `shift-after-method` que afeta o cálculo do peso de caracteres para shift rules. O atributo tem estes valores permitidos:

  + `simple`: Calcula os pesos de caracteres como para reset rules que não possuem um atributo `before`. Este é o default se o atributo não for fornecido.

  + `expand`: Usa expansions para shifts após reset rules.

  Suponha que `'0'` e `'1'` tenham pesos de `0E29` e `0E2A` e queremos colocar todas as letras latinas básicas entre `'0'` e `'1'`:

  ```sql
  <reset>0</reset>
  <pc>abcdefghijklmnopqrstuvwxyz</pc>
  ```

  Para o modo simple shift, os pesos são calculados da seguinte forma:

  ```sql
  'a' has weight 0E29+1
  'b' has weight 0E29+2
  'c' has weight 0E29+3
  ...
  ```

  No entanto, não há posições vagas suficientes para colocar 26 caracteres entre `'0'` e `'1'`. O resultado é que dígitos e letras são misturados (intermixed).

  Para resolver isso, use `shift-after-method="expand"`. Então os pesos são calculados assim:

  ```sql
  'a' has weight [0E29][233D+1]
  'b' has weight [0E29][233D+2]
  'c' has weight [0E29][233D+3]
  ...
  ```

  `233D` é o peso UCA 4.0.0 para o caractere `0xA48C`, que é o último caractere não ignorável (o maior caractere na collation, excluindo CJK). UCA 5.2.0 é semelhante, mas usa `3ACA`, para o caractere `0x1342E`.

**Extensões LDML Específicas do MySQL**

Uma extensão para as rules LDML permite que o elemento `<collation>` inclua um atributo opcional `version` nas tags `<collation>` para indicar a versão UCA na qual a collation se baseia. Se o atributo `version` for omitido, seu valor default é `4.0.0`. Por exemplo, esta especificação indica uma collation que se baseia na UCA 5.2.0:

```sql
<collation id="nnn" name="utf8_xxx_ci" version="5.2.0">
...
</collation>
```