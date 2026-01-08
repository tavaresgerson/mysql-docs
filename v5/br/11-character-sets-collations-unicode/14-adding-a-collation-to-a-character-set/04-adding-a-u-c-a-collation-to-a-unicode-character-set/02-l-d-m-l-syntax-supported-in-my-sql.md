#### 10.14.4.2 Sintaxe LDML suportada no MySQL

Esta seção descreve a sintaxe LDML que o MySQL reconhece. Esta é uma subseção da sintaxe descrita na especificação LDML disponível em <http://www.unicode.org/reports/tr35/>, que deve ser consultada para obter mais informações. O MySQL reconhece um subconjunto suficientemente grande da sintaxe, de modo que, em muitos casos, é possível baixar uma definição de ordenação do Repositório de Dados do Locale Comum Unicode e colar a parte relevante (ou seja, a parte entre as tags `<rules>` e `</rules>`) no arquivo `Index.xml` do MySQL. As regras descritas aqui são todas suportadas, exceto que a ordenação de caracteres ocorre apenas no nível primário. As regras que especificam diferenças em níveis de ordenação secundários ou superiores são reconhecidas (e, portanto, podem ser incluídas em definições de ordenação) mas são tratadas como igualdade no nível primário.

O servidor MySQL gera diagnósticos quando encontra problemas ao analisar o arquivo `Index.xml`. Consulte a Seção 10.14.4.3, “Diagnósticos durante a análise do Index.xml”.

**Representação de Personagens**

Os caracteres nomeados nas regras LDML podem ser escritos literalmente ou no formato `\unnnn`, onde *`nnnn`* é o valor do ponto de código Unicode hexadecimal. Por exemplo, `A` e `á` podem ser escritos literalmente ou como `\u0041` e `\u00E1`. Dentro dos valores hexadecimais, os dígitos `A` a `F` não são sensíveis ao caso; `\u00E1` e `\u00e1` são equivalentes. Para as colatações UCA 4.0.0, a notação hexadecimal só pode ser usada para caracteres na Planilha Multilíngue Básica, e não para caracteres fora da faixa de BMP de `0000` a `FFFF`. Para as colatações UCA 5.2.0, a notação hexadecimal pode ser usada para qualquer caractere.

O próprio arquivo `Index.xml` deve ser escrito com codificação UTF-8.

**Regras de Sintaxe**

O LDML redefiniu as regras de ordenação de caracteres e as regras de deslocamento para especificar a ordem dos caracteres. As ordens são fornecidas como um conjunto de regras que começam com uma regra de redefinição que estabelece um ponto de ancoragem, seguido por regras de deslocamento que indicam como os caracteres são ordenados em relação ao ponto de ancoragem.

- Uma regra `<reset>` não especifica qualquer ordem por si só. Em vez disso, ela “redefine” a ordem para que as regras de deslocamento subsequentes sejam aplicadas em relação a um caractere específico. Qualquer uma das seguintes regras redefine as regras de deslocamento subsequentes para serem aplicadas em relação à letra `'A'`:

  ```sql
  <reset>A</reset>

  <reset>\u0041</reset>
  ```

- As regras de deslocamento `<p>`, `<s>` e `<t>` definem as diferenças primárias, secundárias e terciárias de um caractere em relação a outro:

  - Use diferenças primárias para distinguir letras separadas.

  - Use diferenças secundárias para distinguir as variações de sotaque.

  - Use diferenças terciárias para distinguir as variações de maiúsculas e minúsculas.

  Uma dessas regras especifica uma regra de deslocamento primário para o caractere `'G'`:

  ```sql
  <p>G</p>

  <p>\u0047</p>
  ```

- A regra de deslocamento `<i>` indica que um caractere se classifica de forma idêntica a outro. As seguintes regras fazem com que `'b'` se classifique da mesma forma que `'a'`:

  ```sql
  <reset>a</reset>
  <i>b</i>
  ```

- A sintaxe de deslocamento abreviada especifica múltiplas regras de deslocamento usando um único par de tags. A tabela a seguir mostra a correspondência entre as regras de sintaxe abreviada e as regras equivalentes não abreviadas.

  **Tabela 10.5 Sintaxe de Deslocamento Abreviado**

  <table summary="Regras de sintaxe de deslocamento abreviado e correspondente à sintaxe não abreviada."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Sintaxe abreviada</th> <th>Sintaxe não abreviada</th> </tr></thead><tbody><tr> <td>[[<code>&lt;pc&gt;xyz&lt;/pc&gt;</code>]]</td> <td>[[<code>&lt;p&gt;x&lt;/p&gt;&lt;p&gt;y&lt;/p&gt;&lt;p&gt;z&lt;/p&gt;</code>]]</td> </tr><tr> <td>[[<code>&lt;sc&gt;xyz&lt;/sc&gt;</code>]]</td> <td>[[<code>&lt;s&gt;x&lt;/s&gt;&lt;s&gt;y&lt;/s&gt;&lt;s&gt;z&lt;/s&gt;</code>]]</td> </tr><tr> <td>[[<code>&lt;tc&gt;xyz&lt;/tc&gt;</code>]]</td> <td>[[<code>&lt;t&gt;x&lt;/t&gt;&lt;t&gt;y&lt;/t&gt;&lt;t&gt;z&lt;/t&gt;</code>]]</td> </tr><tr> <td>[[<code>&lt;ic&gt;xyz&lt;/ic&gt;</code>]]</td> <td>[[<code>&lt;i&gt;x&lt;/i&gt;&lt;i&gt;y&lt;/i&gt;&lt;i&gt;z&lt;/i&gt;</code>]]</td> </tr></tbody></table>

- Uma expansão é uma regra de reposicionamento que estabelece um ponto de ancoragem para uma sequência de vários caracteres. O MySQL suporta expansões de 2 a 6 caracteres. As seguintes regras colocam `'z'` no nível primário maior do que a sequência de três caracteres `'abc'`:

  ```sql
  <reset>abc</reset>
  <p>z</p>
  ```

- Uma contração é uma regra de ordenação que classifica uma sequência de vários caracteres. O MySQL suporta contrações de 2 a 6 caracteres. As seguintes regras colocam a sequência de três caracteres `'xyz'` no nível primário acima de `'a'`:

  ```sql
  <reset>a</reset>
  <p>xyz</p>
  ```

- As expansões longas e as contrações longas podem ser usadas juntas. Essas regras colocam a sequência de três caracteres `'xyz'` em um nível primário maior do que a sequência de três caracteres `'abc'`:

  ```sql
  <reset>abc</reset>
  <p>xyz</p>
  ```

- A sintaxe de expansão normal usa `<x>` mais elementos `<extend>` para especificar uma expansão. As seguintes regras colocam o caractere `'k'` no nível secundário acima da sequência `'ch'`. Isso significa que `'k'` se comporta como se expandisse para um caractere após `'c'` seguido por `'h'`:

  ```sql
  <reset>c</reset>
  <x><s>k</s><extend>h</extend></x>
  ```

  Essa sintaxe permite sequências longas. Essas regras classificam a sequência `'ccs'` como maior no nível terciário do que a sequência `'cscs'`:

  ```sql
  <reset>cs</reset>
  <x><t>ccs</t><extend>cs</extend></x>
  ```

  A especificação LDML descreve a sintaxe de expansão normal como "complexa". Veja essa especificação para obter detalhes.

- O contexto anterior usa `<x>` mais `<context>` para especificar que o contexto antes de um caractere afeta a forma como ele é classificado. As seguintes regras colocam `'-'` em um nível secundário maior que `'a'`, mas apenas quando `'-'` ocorre após `'b'`:

  ```sql
  <reset>a</reset>
  <x><context>b</context><s>-</s></x>
  ```

- O contexto anterior da sintaxe pode incluir o elemento `<extend>`. Essas regras colocam `'def'` em um nível primário maior que `'aghi'`, mas apenas quando `'def'` vem após `'abc'`:

  ```sql
  <reset>a</reset>
  <x><context>abc</context><p>def</p><extend>ghi</extend></x>
  ```

- As regras de deslocamento permitem um atributo `before`. Normalmente, as regras de deslocamento após uma regra de deslocamento indicam caracteres que são ordenados após o caractere de deslocamento. As regras de deslocamento após uma regra de deslocamento que tem o atributo `before` indicam caracteres que são ordenados antes do caractere de deslocamento. As seguintes regras colocam o caractere `'b'` imediatamente antes de `'a'` no nível primário:

  ```sql
  <reset before="primary">a</reset>
  <p>b</p>
  ```

  Os valores permitidos do atributo `before` especificam o nível de classificação por nome ou o valor numérico equivalente:

  ```sql
  <reset before="primary">
  <reset before="1">

  <reset before="secondary">
  <reset before="2">

  <reset before="tertiary">
  <reset before="3">
  ```

- Uma regra de reinicialização pode nomear uma posição de reinicialização lógica em vez de um caractere literal:

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

  Essas regras colocam `'z'` em um nível primário maior do que caracteres não ignoráveis que têm uma entrada na Tabela de Elementos de Cotação Unicode Padrão (DUCET) e que não são CJK:

  ```sql
  <reset><last_non_ignorable/></reset>
  <p>z</p>
  ```

  As posições lógicas têm os códigos mostrados na tabela a seguir.

  **Tabela 10.6. Pontos de código de posição de reinicialização lógica**

  <table summary="Posições lógicas e pontos de código Unicode 4.0.0 e Unicode 5.2.0."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Posição Lógica</th> <th scope="col">Ponto de código Unicode 4.0.0</th> <th scope="col">Ponto de código Unicode 5.2.0</th> </tr></thead><tbody><tr> <th scope="row">[[PH_HTML_CODE_<code>&lt;first_variable/&gt;</code>]</th> <td>U+02D0</td> <td>U+02D0</td> </tr><tr> <th scope="row">[[PH_HTML_CODE_<code>&lt;first_variable/&gt;</code>]</th> <td>U+A48C</td> <td>U+1342E</td> </tr><tr> <th scope="row">[[<code>&lt;first_primary_ignorable/&gt;</code>]]</th> <td>U+0332</td> <td>U+0332</td> </tr><tr> <th scope="row">[[<code>&lt;last_primary_ignorable/&gt;</code>]]</th> <td>U+20EA</td> <td>U+101FD</td> </tr><tr> <th scope="row">[[<code>&lt;first_secondary_ignorable/&gt;</code>]]</th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th scope="row">[[<code>&lt;last_secondary_ignorable/&gt;</code>]]</th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th scope="row">[[<code>&lt;first_tertiary_ignorable/&gt;</code>]]</th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th scope="row">[[<code>&lt;last_tertiary_ignorable/&gt;</code>]]</th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th scope="row">[[<code>&lt;first_trailing/&gt;</code>]]</th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th scope="row">[[<code>&lt;last_trailing/&gt;</code>]]</th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th scope="row">[[<code>&lt;first_variable/&gt;</code>]]</th> <td>U+0009</td> <td>U+0009</td> </tr><tr> <th scope="row">[[<code>&lt;last_non_ignorable/&gt;</code><code>&lt;first_variable/&gt;</code>]</th> <td>U+2183</td> <td>U+1D371</td> </tr></tbody></table>

- O elemento `<collation>` permite um atributo `shift-after-method` que afeta o cálculo do peso dos caracteres para as regras de deslocamento. O atributo tem esses valores permitidos:

  - `simple`: Calcule os pesos dos caracteres como para regras de redefinição que não têm um atributo `before`. Isso é o padrão se o atributo não for fornecido.

  - `expand`: Use expansões para mudanças após regras de reinicialização.

  Suponha que `'0'` e `'1'` tenham pesos de `0E29` e `0E2A` e que queiramos colocar todas as letras latinas básicas entre `'0'` e `'1'`:

  ```sql
  <reset>0</reset>
  <pc>abcdefghijklmnopqrstuvwxyz</pc>
  ```

  Para o modo de mudança simples, os pesos são calculados da seguinte forma:

  ```sql
  'a' has weight 0E29+1
  'b' has weight 0E29+2
  'c' has weight 0E29+3
  ...
  ```

  No entanto, não há vagas suficientes para colocar 26 caracteres entre `'0'` e `'1'`. O resultado é que os dígitos e as letras estão misturados.

  Para resolver isso, use `shift-after-method="expand"`. Em seguida, os pesos são calculados da seguinte forma:

  ```sql
  'a' has weight [0E29][233D+1]
  'b' has weight [0E29][233D+2]
  'c' has weight [0E29][233D+3]
  ...
  ```

  `233D` é o peso do UCA 4.0.0 para o caractere `0xA48C`, que é o último caractere não ignorável (um tipo de maior caractere na ordenação, excluindo CJK). O UCA 5.2.0 é semelhante, mas usa `3ACA`, para o caractere `0x1342E`.

**Extensões LDML específicas para MySQL**

Uma extensão das regras do LDML permite que o elemento `<collation>` inclua um atributo opcional `version` nas tags `<collation>` para indicar a versão do UCA em que a ordenação se baseia. Se o atributo `version` for omitido, seu valor padrão é `4.0.0`. Por exemplo, esta especificação indica uma ordenação que se baseia no UCA 5.2.0:

```sql
<collation id="nnn" name="utf8_xxx_ci" version="5.2.0">
...
</collation>
```
