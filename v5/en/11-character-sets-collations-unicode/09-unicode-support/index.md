## 10.9 Suporte a Unicode

10.9.1 O Character Set utf8mb4 (Codificação Unicode UTF-8 de 4 Bytes)

10.9.2 O Character Set utf8mb3 (Codificação Unicode UTF-8 de 3 Bytes)

10.9.3 O Character Set utf8 (Alias para utf8mb3)

10.9.4 O Character Set ucs2 (Codificação Unicode UCS-2)

10.9.5 O Character Set utf16 (Codificação Unicode UTF-16)

10.9.6 O Character Set utf16le (Codificação Unicode UTF-16LE)

10.9.7 O Character Set utf32 (Codificação Unicode UTF-32)

10.9.8 Convertendo Entre Character Sets Unicode de 3 Bytes e 4 Bytes

O Standard Unicode inclui caracteres do Plano Multilíngue Básico (BMP) e caracteres suplementares que se encontram fora do BMP. Esta seção descreve o suporte a Unicode no MySQL. Para obter informações sobre o próprio Standard Unicode, visite o site do Consórcio Unicode.

Os caracteres BMP têm as seguintes características:

* Seus valores de code point estão entre 0 e 65535 (ou `U+0000` e `U+FFFF`).

* Eles podem ser codificados em uma codificação de comprimento variável usando 8, 16 ou 24 bits (1 a 3 bytes).

* Eles podem ser codificados em uma codificação de comprimento fixo usando 16 bits (2 bytes).

* Eles são suficientes para quase todos os caracteres nas principais linguagens.

Caracteres suplementares estão fora do BMP:

* Seus valores de code point estão entre `U+10000` e `U+10FFFF`).

* O suporte a Unicode para caracteres suplementares requer character sets que possuam um range fora dos caracteres BMP e, portanto, ocupam mais espaço do que os caracteres BMP (até 4 bytes por caractere).

O método UTF-8 (Unicode Transformation Format with 8-bit units) para codificar dados Unicode é implementado de acordo com a RFC 3629, que descreve sequências de codificação que utilizam de um a quatro bytes. A ideia do UTF-8 é que vários caracteres Unicode são codificados usando sequências de bytes de diferentes comprimentos:

* Letras Latim básicas, dígitos e sinais de pontuação usam um byte.

* A maioria das letras de scripts europeus e do Oriente Médio cabem em uma sequência de 2 bytes: letras Latim estendidas (com til, mácron, acento agudo, acento grave e outros acentos), Cirílico, Grego, Armênio, Hebraico, Árabe, Siríaco e outros.

* Ideogramas coreanos, chineses e japoneses usam sequências de 3 ou 4 bytes.

O MySQL suporta os seguintes character sets Unicode:

* `utf8mb4`: Uma codificação UTF-8 do character set Unicode usando de um a quatro bytes por caractere.

* `utf8mb3`: Uma codificação UTF-8 do character set Unicode usando de um a três bytes por caractere.

* `utf8`: Um alias para `utf8mb3`.

* `ucs2`: A codificação UCS-2 do character set Unicode usando dois bytes por caractere.

* `utf16`: A codificação UTF-16 para o character set Unicode usando dois ou quatro bytes por caractere. Semelhante ao `ucs2`, mas com uma extensão para caracteres suplementares.

* `utf16le`: A codificação UTF-16LE para o character set Unicode. Semelhante ao `utf16`, mas little-endian em vez de big-endian.

* `utf32`: A codificação UTF-32 para o character set Unicode usando quatro bytes por caractere.

A Tabela 10.2, “Características Gerais do Character Set Unicode”, resume as características gerais dos character sets Unicode suportados pelo MySQL.

**Tabela 10.2 Características Gerais do Character Set Unicode**

<table summary="Características gerais dos character sets Unicode."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Character Set</th> <th>Caracteres Suportados</th> <th>Armazenamento Necessário Por Caractere</th> </tr></thead><tbody><tr> <th><code>utf8mb3</code>, <code>utf8</code></th> <td>Apenas BMP</td> <td>1, 2, ou 3 bytes</td> </tr><tr> <th><code>ucs2</code></th> <td>Apenas BMP</td> <td>2 bytes</td> </tr><tr> <th><code>utf8mb4</code></th> <td>BMP e suplementares</td> <td>1, 2, 3, ou 4 bytes</td> </tr><tr> <th><code>utf16</code></th> <td>BMP e suplementares</td> <td>2 ou 4 bytes</td> </tr><tr> <th><code>utf16le</code></th> <td>BMP e suplementares</td> <td>2 ou 4 bytes</td> </tr><tr> <th><code>utf32</code></th> <td>BMP e suplementares</td> <td>4 bytes</td> </tr> </tbody></table>

Caracteres fora do BMP são comparados como REPLACEMENT CHARACTER e convertidos para `'?'` quando convertidos para um character set Unicode que suporta apenas caracteres BMP (`utf8mb3` ou `ucs2`).

Se você usar character sets que suportam caracteres suplementares e, portanto, são "mais amplos" do que os character sets `utf8mb3` e `ucs2` (somente BMP), há potenciais problemas de incompatibilidade para suas aplicações; consulte a Seção 10.9.8, “Convertendo Entre Character Sets Unicode de 3 Bytes e 4 Bytes”. Essa seção também descreve como converter tabelas do `utf8mb3` (3 bytes) para o `utf8mb4` (4 bytes) e quais restrições podem ser aplicadas ao fazê-lo.

Um conjunto semelhante de collations está disponível para a maioria dos character sets Unicode. Por exemplo, cada um tem uma collation dinamarquesa, cujos nomes são `utf8mb4_danish_ci`, `utf8mb3_danish_ci`, `utf8_danish_ci`, `ucs2_danish_ci`, `utf16_danish_ci` e `utf32_danish_ci`. A exceção é `utf16le`, que possui apenas duas collations. Para obter informações sobre collations Unicode e suas propriedades diferenciadoras, incluindo propriedades de collation para caracteres suplementares, consulte a Seção 10.10.1, “Character Sets Unicode”.

A implementação do MySQL para UCS-2, UTF-16 e UTF-32 armazena caracteres em ordem de byte big-endian e não usa uma marca de ordem de byte (BOM) no início dos valores. Outros sistemas de Database podem usar ordem de byte little-endian ou um BOM. Nesses casos, a conversão de valores deve ser realizada ao transferir dados entre esses sistemas e o MySQL. A implementação de UTF-16LE é little-endian.

O MySQL não usa BOM para valores UTF-8.

Aplicações cliente que se comunicam com o server usando Unicode devem definir o character set do cliente adequadamente (por exemplo, emitindo uma instrução `SET NAMES 'utf8mb4'`). Alguns character sets não podem ser usados como o character set do cliente. A tentativa de usá-los com `SET NAMES` ou `SET CHARACTER SET` produz um erro. Consulte Character Sets de Cliente Não Permitidos.

As seções a seguir fornecem detalhes adicionais sobre os character sets Unicode no MySQL.