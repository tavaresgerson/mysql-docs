#### 12.10.7.1 O Conjunto de Caracteres cp932

**Por que o `cp932` é necessário?**

No MySQL, o conjunto de caracteres `sjis` corresponde ao conjunto de caracteres `Shift_JIS` definido pela IANA, que suporta caracteres JIS X0201 e JIS X0208. (Veja <http://www.iana.org/assignments/character-sets>.)

No entanto, o significado de “SHIFT JIS” como um termo descritivo tornou-se muito vago e muitas vezes inclui as extensões do `Shift_JIS` definidas por vários fornecedores.

Por exemplo, “SHIFT JIS” usado em ambientes Windows japoneses é uma extensão da Microsoft do `Shift_JIS` e seu nome exato é `Microsoft Windows Codepage : 932` ou `cp932`. Além dos caracteres suportados pelo `Shift_JIS`, o `cp932` suporta caracteres de extensão, como caracteres especiais NEC, caracteres extensos selecionados pela IBM e caracteres selecionados pela IBM.

Muitos usuários japoneses tiveram problemas ao usar esses caracteres de extensão. Esses problemas decorrem dos seguintes fatores:

* O MySQL converte automaticamente os conjuntos de caracteres.
* Os conjuntos de caracteres são convertidos usando o Unicode (`ucs2`).

* O conjunto de caracteres `sjis` não suporta a conversão desses caracteres de extensão.

* Existem várias regras de conversão do chamado “SHIFT JIS” para o Unicode, e alguns caracteres são convertidos para o Unicode de maneira diferente dependendo da regra de conversão. O MySQL suporta apenas uma dessas regras (descrita mais adiante).

O conjunto de caracteres `cp932` do MySQL foi projetado para resolver esses problemas.

Como o MySQL suporta a conversão de conjuntos de caracteres, é importante separar o `Shift_JIS` e o `cp932` da IANA em dois conjuntos de caracteres diferentes, pois eles fornecem regras de conversão diferentes.

**Como o `cp932` difere do `sjis`?**

O conjunto de caracteres `cp932` difere do `sjis` das seguintes maneiras:

* O `cp932` suporta caracteres especiais da NEC, caracteres especiais da NEC selecionados — caracteres extensos da IBM selecionados e caracteres extensos da IBM selecionados.

* Alguns caracteres do `cp932` têm dois pontos de código diferentes, ambos convertidos para o mesmo ponto de código Unicode. Ao converter do Unicode de volta para o `cp932`, um dos pontos de código deve ser selecionado. Para essa "conversão de ida e volta", a regra recomendada pela Microsoft é usada. (Veja <http://support.microsoft.com/kb/170559/EN-US/>.)

  A regra de conversão funciona da seguinte maneira:

  + Se o caractere estiver nos caracteres especiais da JIS X 0208 e nos caracteres especiais da NEC, use o ponto de código da JIS X 0208.

  + Se o caractere estiver nos caracteres especiais da NEC e nos caracteres extensos da IBM selecionados, use o ponto de código dos caracteres especiais da NEC.

  + Se o caractere estiver nos caracteres extensos da IBM selecionados e nos caracteres extensos da NEC selecionados — IBM, use o ponto de código dos caracteres extensos da IBM.

  A tabela mostrada em <https://msdn.microsoft.com/en-us/goglobal/cc305152.aspx> fornece informações sobre os valores Unicode dos caracteres do `cp932`. Para entradas da tabela do `cp932` com caracteres sob os quais aparece um número de quatro dígitos, o número representa a codificação Unicode (`ucs2`) correspondente. Para entradas da tabela com um valor de dois dígitos sublinhado, há uma faixa de valores de caracteres do `cp932` que começam com esses dois dígitos. Ao clicar em uma entrada da tabela, você é direcionado para uma página que exibe o valor Unicode para cada um dos caracteres do `cp932` que começam com esses dígitos.

  Os seguintes links são de interesse especial. Eles correspondem às codificações para os seguintes conjuntos de caracteres:

  + Caracteres especiais da NEC (byte inicial `0x87`):

    ```
    https://msdn.microsoft.com/en-us/goglobal/gg674964
    ```

  + Caracteres extensos da IBM selecionados (byte inicial `0xED` e `0xEE`):

    ```
    https://msdn.microsoft.com/en-us/goglobal/gg671837
    https://msdn.microsoft.com/en-us/goglobal/gg671838
    ```

  + Caracteres selecionados da IBM (byte inicial `0xFA`, `0xFB`, `0xFC`):

```
    https://msdn.microsoft.com/en-us/goglobal/gg671839
    https://msdn.microsoft.com/en-us/goglobal/gg671840
    https://msdn.microsoft.com/en-us/goglobal/gg671841
    ```

* O `cp932` suporta a conversão de caracteres definidos pelo usuário em combinação com `eucjpms`, e resolve os problemas com a conversão de `sjis`/`ujis`. Para detalhes, consulte <http://www.sljfaq.org/afaq/encodings.html>.

Para alguns caracteres, a conversão para e a partir de `ucs2` é diferente para `sjis` e `cp932`. As seguintes tabelas ilustram essas diferenças.

Conversão para `ucs2`:

<table summary="valores de `sjis`/`cp932` e a diferença entre a conversão de `sjis` para `ucs2` e a conversão de `cp932` para `ucs2`."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col"><code class="literal">sjis</code>/<code class="literal">cp932</code> Value</th> <th scope="col"><code class="literal">sjis</code> -&gt; <code class="literal">ucs2</code> Conversion</th> <th scope="col"><code class="literal">cp932</code> -&gt; <code class="literal">ucs2</code> Conversion</th> </tr></thead><tbody><tr> <th scope="row">5C</th> <td>005C</td> <td>005C</td> </tr><tr> <th scope="row">7E</th> <td>007E</td> <td>007E</td> </tr><tr> <th scope="row">815C</th> <td>2015</td> <td>2015</td> </tr><tr> <th scope="row">815F</th> <td>005C</td> <td>FF3C</td> </tr><tr> <th scope="row">8160</th> <td>301C</td> <td>FF5E</td> </tr><tr> <th scope="row">8161</th> <td>2016</td> <td>2225</td> </tr><tr> <th scope="row">817C</th> <td>2212</td> <td>FF0D</td> </tr><tr> <th scope="row">8191</th> <td>00A2</td> <td>FFE0</td> </tr><tr> <th scope="row">8192</th> <td>00A3</td> <td>FFE1</td> </tr><tr> <th scope="row">81CA</th> <td>00AC</td> <td>FFE2</td> </tr></tbody></table>

Conversão de `ucs2`:

<table summary="valores de ucs2 e a diferença entre a conversão de ucs2 para sjis e a conversão de ucs2 para cp932."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col"><code class="literal">ucs2</code> value</th> <th scope="col"><code class="literal">ucs2</code> -&gt; <code class="literal">sjis</code> Conversion</th> <th scope="col"><code class="literal">ucs2</code> -&gt; <code class="literal">cp932</code> Conversion</th> </tr></thead><tbody><tr> <th scope="row">005C</th> <td>815F</td> <td>5C</td> </tr><tr> <th scope="row">007E</th> <td>7E</td> <td>7E</td> </tr><tr> <th scope="row">00A2</th> <td>8191</td> <td>3F</td> </tr><tr> <th scope="row">00A3</th> <td>8192</td> <td>3F</td> </tr><tr> <th scope="row">00AC</th> <td>81CA</td> <td>3F</td> </tr><tr> <th scope="row">2015</th> <td>815C</td> <td>815C</td> </tr><tr> <th scope="row">2016</th> <td>8161</td> <td>3F</td> </tr><tr> <th scope="row">2212</th> <td>817C</td> <td>3F</td> </tr><tr> <th scope="row">2225</th> <td>3F</td> <td>8161</td> </tr><tr> <th scope="row">301C</th> <td>8160</td> <td>3F</td> </tr><tr> <th scope="row">FF0D</th> <td>3F</td> <td>817C</td> </tr><tr> <th scope="row">FF3C</th> <td>3F</td> <td>815F</td> </tr><tr> <th scope="row">FF5E</th> <td>3F</td> <td>8160</td> </tr><tr> <th scope="row">FFE0</th> <td>3F</td> <td>8191</td> </tr><tr> <th scope="row">FFE1</th> <td>3F</td> <td>8192</td> </tr><tr> <th scope="row">FFE2</th> <td>3F</td> <td>81CA</td> </tr></tbody></table>