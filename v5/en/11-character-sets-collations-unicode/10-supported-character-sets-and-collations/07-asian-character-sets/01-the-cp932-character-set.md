#### 10.10.7.1 O Character Set cp932

**Por que `cp932` é necessário?**

No MySQL, o Character Set `sjis` corresponde ao Character Set `Shift_JIS` definido pela IANA, que suporta caracteres JIS X0201 e JIS X0208. (Veja <http://www.iana.org/assignments/character-sets>.)

No entanto, o significado de “SHIFT JIS” como termo descritivo tornou-se muito vago e frequentemente inclui as extensões do `Shift_JIS` definidas por vários fornecedores (vendors).

Por exemplo, o “SHIFT JIS” usado em ambientes Windows japoneses é uma extensão Microsoft do `Shift_JIS` e seu nome exato é `Microsoft Windows Codepage : 932` ou `cp932`. Além dos caracteres suportados pelo `Shift_JIS`, o `cp932` suporta caracteres de extensão, como caracteres especiais NEC, caracteres estendidos NEC selecionados—IBM, e caracteres selecionados IBM.

Muitos usuários japoneses têm tido problemas ao usar esses caracteres de extensão. Esses problemas decorrem dos seguintes fatores:

* O MySQL converte Character Sets automaticamente.
* Character Sets são convertidos usando Unicode (`ucs2`).
* O Character Set `sjis` não suporta a conversão desses caracteres de extensão.
* Existem várias regras de conversão do chamado “SHIFT JIS” para Unicode, e alguns caracteres são convertidos para Unicode de forma diferente dependendo da regra de conversão. O MySQL suporta apenas uma dessas regras (descrita posteriormente).

O Character Set `cp932` do MySQL foi projetado para resolver esses problemas.

Como o MySQL suporta conversão de Character Set, é importante separar IANA `Shift_JIS` e `cp932` em dois Character Sets diferentes, pois eles fornecem regras de conversão distintas.

**Como `cp932` difere de `sjis`?**

O Character Set `cp932` difere de `sjis` das seguintes maneiras:

* `cp932` suporta caracteres especiais NEC, caracteres estendidos NEC selecionados—IBM, e caracteres selecionados IBM.

* Alguns caracteres `cp932` têm dois Code Points diferentes, ambos se convertendo para o mesmo Code Point Unicode. Ao converter de Unicode de volta para `cp932` (conversão de round trip), um dos Code Points deve ser selecionado. Para esta “round trip conversion,” é usada a regra recomendada pela Microsoft. (Veja <http://support.microsoft.com/kb/170559/EN-US/>.)

  A regra de conversão funciona assim:

  + Se o caractere estiver tanto em JIS X 0208 quanto em caracteres especiais NEC, use o Code Point de JIS X 0208.

  + Se o caractere estiver tanto em caracteres especiais NEC quanto em caracteres selecionados IBM, use o Code Point de caracteres especiais NEC.

  + Se o caractere estiver tanto em caracteres selecionados IBM quanto em caracteres estendidos NEC selecionados—IBM, use o Code Point de caracteres estendidos IBM.

  A tabela mostrada em <https://msdn.microsoft.com/en-us/goglobal/cc305152.aspx> fornece informações sobre os valores Unicode dos caracteres `cp932`. Para entradas na tabela `cp932` com caracteres sob os quais aparece um número de quatro dígitos, o número representa a codificação Unicode (`ucs2`) correspondente. Para entradas na tabela onde aparece um valor sublinhado de dois dígitos, há um range de valores de caracteres `cp932` que começam com esses dois dígitos. Clicar em tal entrada da tabela leva você a uma página que exibe o valor Unicode para cada um dos caracteres `cp932` que começam com esses dígitos.

  Os seguintes links são de interesse especial. Eles correspondem às codificações para os seguintes conjuntos de caracteres:

  + Caracteres especiais NEC (byte inicial `0x87`):

    ```sql
    https://msdn.microsoft.com/en-us/goglobal/gg674964
    ```

  + Caracteres estendidos NEC selecionados—IBM (byte inicial `0xED` e `0xEE`):

    ```sql
    https://msdn.microsoft.com/en-us/goglobal/gg671837
    https://msdn.microsoft.com/en-us/goglobal/gg671838
    ```

  + Caracteres selecionados IBM (byte inicial `0xFA`, `0xFB`, `0xFC`):

    ```sql
    https://msdn.microsoft.com/en-us/goglobal/gg671839
    https://msdn.microsoft.com/en-us/goglobal/gg671840
    https://msdn.microsoft.com/en-us/goglobal/gg671841
    ```

* `cp932` suporta a conversão de caracteres definidos pelo usuário em combinação com `eucjpms` e resolve os problemas com a conversão `sjis`/`ujis`. Para detalhes, consulte <http://www.sljfaq.org/afaq/encodings.html>.

Para alguns caracteres, a conversão para e de `ucs2` é diferente para `sjis` e `cp932`. As tabelas a seguir ilustram essas diferenças.

Conversão para `ucs2`:

<table summary="Valores sjis/cp932 e a diferença entre a conversão de sjis para ucs2 e cp932 para ucs2."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Valor <code>sjis</code>/<code>cp932</code></th> <th>Conversão <code>sjis</code> -&gt; <code>ucs2</code></th> <th>Conversão <code>cp932</code> -&gt; <code>ucs2</code></th> </tr></thead><tbody><tr> <th>5C</th> <td>005C</td> <td>005C</td> </tr><tr> <th>7E</th> <td>007E</td> <td>007E</td> </tr><tr> <th>815C</th> <td>2015</td> <td>2015</td> </tr><tr> <th>815F</th> <td>005C</td> <td>FF3C</td> </tr><tr> <th>8160</th> <td>301C</td> <td>FF5E</td> </tr><tr> <th>8161</th> <td>2016</td> <td>2225</td> </tr><tr> <th>817C</th> <td>2212</td> <td>FF0D</td> </tr><tr> <th>8191</th> <td>00A2</td> <td>FFE0</td> </tr><tr> <th>8192</th> <td>00A3</td> <td>FFE1</td> </tr><tr> <th>81CA</th> <td>00AC</td> <td>FFE2</td> </tr> </tbody></table>

Conversão de `ucs2`:

<table summary="Valores ucs2 e a diferença entre a conversão de ucs2 para sjis e ucs2 para cp932."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Valor <code>ucs2</code></th> <th>Conversão <code>ucs2</code> -&gt; <code>sjis</code></th> <th>Conversão <code>ucs2</code> -&gt; <code>cp932</code></th> </tr></thead><tbody><tr> <th>005C</th> <td>815F</td> <td>5C</td> </tr><tr> <th>007E</th> <td>7E</td> <td>7E</td> </tr><tr> <th>00A2</th> <td>8191</td> <td>3F</td> </tr><tr> <th>00A3</th> <td>8192</td> <td>3F</td> </tr><tr> <th>00AC</th> <td>81CA</td> <td>3F</td> </tr><tr> <th>2015</th> <td>815C</td> <td>815C</td> </tr><tr> <th>2016</th> <td>8161</td> <td>3F</td> </tr><tr> <th>2212</th> <td>817C</td> <td>3F</td> </tr><tr> <th>2225</th> <td>3F</td> <td>8161</td> </tr><tr> <th>301C</th> <td>8160</td> <td>3F</td> </tr><tr> <th>FF0D</th> <td>3F</td> <td>817C</td> </tr><tr> <th>FF3C</th> <td>3F</td> <td>815F</td> </tr><tr> <th>FF5E</th> <td>3F</td> <td>8160</td> </tr><tr> <th>FFE0</th> <td>3F</td> <td>8191</td> </tr><tr> <th>FFE1</th> <td>3F</td> <td>8192</td> </tr><tr> <th>FFE2</th> <td>3F</td> <td>81CA</td> </tr> </tbody></table>

Usuários de qualquer Character Set japonês devem estar cientes de que o uso de `--character-set-client-handshake` (ou `--skip-character-set-client-handshake`) tem um efeito importante. Consulte Seção 5.1.6, “Opções de Comando do Servidor”.