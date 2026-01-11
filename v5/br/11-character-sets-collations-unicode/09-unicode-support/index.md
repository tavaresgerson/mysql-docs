## 10.9 Suporte a Unicode

10.9.1 Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 bytes)

10.9.2 Conjunto de Caracteres utf8mb3 (Codificação Unicode UTF-8 de 3 bytes)

10.9.3 O conjunto de caracteres utf8 (alias para utf8mb3)

10.9.4 O Conjunto de Caracteres ucs2 (Codificação Unicode UCS-2)

10.9.5 Conjunto de Caracteres utf16 (Codificação Unicode UTF-16)

10.9.6 Conjunto de Caracteres utf16le (Codificação Unicode UTF-16LE)

10.9.7 Conjunto de Caracteres utf32 (Codificação Unicode UTF-32)

10.9.8 Conversão entre conjuntos de caracteres Unicode de 3 e 4 bytes

O Padrão Unicode inclui caracteres do Plano Multilíngue Básico (BMP) e caracteres suplementares que estão fora do BMP. Esta seção descreve o suporte para o Unicode no MySQL. Para obter informações sobre o próprio Padrão Unicode, visite o site do Consórcio Unicode.

Os caracteres BMP têm essas características:

- Seus valores de ponto de código estão entre 0 e 65535 (ou `U+0000` e `U+FFFF`).

- Eles podem ser codificados em uma codificação de comprimento variável, usando 8, 16 ou 24 bits (1 a 3 bytes).

- Eles podem ser codificados em uma codificação de comprimento fixo usando 16 bits (2 bytes).

- Eles são suficientes para quase todos os caracteres das principais línguas.

Caracteres suplementares estão fora do BMP:

- Seus valores de ponto de código estão entre `U+10000` e `U+10FFFF`).

- O suporte ao Unicode para caracteres suplementares exige conjuntos de caracteres que tenham um intervalo fora dos caracteres BMP e, portanto, ocupem mais espaço do que os caracteres BMP (até 4 bytes por caractere).

O método UTF-8 (Formato de Transformação Unicode com Unidades de 8 bits) para codificação de dados Unicode é implementado de acordo com o RFC 3629, que descreve sequências de codificação que variam de um a quatro bytes. A ideia do UTF-8 é que vários caracteres Unicode sejam codificados usando sequências de bytes de diferentes comprimentos:

- As letras latinas básicas, dígitos e sinais de pontuação usam um byte.

- A maioria das letras de scripts europeus e do Oriente Médio cabem em uma sequência de 2 bytes: letras latinas estendidas (com tilde, macron, acentuado, grave e outros acentos), cirílico, grego, armênio, hebraico, árabe, siríaco e outros.

- Os ideogramas coreanos, chineses e japoneses usam sequências de 3 ou 4 bytes.

O MySQL suporta esses conjuntos de caracteres Unicode:

- `utf8mb4`: Uma codificação UTF-8 do conjunto de caracteres Unicode que usa de um a quatro bytes por caractere.

- `utf8mb3`: Uma codificação UTF-8 do conjunto de caracteres Unicode que usa de um a três bytes por caractere.

- `utf8`: Um alias para `utf8mb3`.

- `ucs2`: A codificação UCS-2 do conjunto de caracteres Unicode, que utiliza dois bytes por caractere.

- `utf16`: A codificação UTF-16 para o conjunto de caracteres Unicode, usando dois ou quatro bytes por caractere. Como `ucs2`, mas com uma extensão para caracteres suplementares.

- `utf16le`: A codificação UTF-16LE para o conjunto de caracteres Unicode. É semelhante ao `utf16`, mas é little-endian em vez de big-endian.

- `utf32`: A codificação UTF-32 para o conjunto de caracteres Unicode, usando quatro bytes por caractere.

A Tabela 10.2, “Características Gerais do Conjunto de Caracteres Unicode”, resume as características gerais dos conjuntos de caracteres Unicode suportados pelo MySQL.

**Tabela 10.2 Características gerais do conjunto de caracteres Unicode**

<table summary="Características gerais dos conjuntos de caracteres Unicode."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Conjunto de caracteres</th> <th>Caracteres suportados</th> <th>Armazenamento necessário por caractere</th> </tr></thead><tbody><tr> <th><code>utf8mb3</code>, <code>utf8</code></th> <td>Apenas BMP</td> <td>1, 2 ou 3 bytes</td> </tr><tr> <th><code>ucs2</code></th> <td>Apenas BMP</td> <td>2 bytes</td> </tr><tr> <th><code>utf8mb4</code></th> <td>BMP e suplementar</td> <td>1, 2, 3 ou 4 bytes</td> </tr><tr> <th><code>utf16</code></th> <td>BMP e suplementar</td> <td>2 ou 4 bytes</td> </tr><tr> <th><code>utf16le</code></th> <td>BMP e suplementar</td> <td>2 ou 4 bytes</td> </tr><tr> <th><code>utf32</code></th> <td>BMP e suplementar</td> <td>4 bytes</td> </tr></tbody></table>

Caracteres fora do BMP são comparados como CARACTERE DE REPLICAÇÃO e convertidos em `'?'` quando convertidos para um conjunto de caracteres Unicode que suporta apenas caracteres do BMP (`utf8mb3` ou `ucs2`).

Se você usar conjuntos de caracteres que suportam caracteres suplementares e, portanto, são “mais amplos” do que os conjuntos de caracteres `utf8mb3` e `ucs2`, que só suportam BMP, há potenciais problemas de incompatibilidade para suas aplicações; veja a Seção 10.9.8, “Conversão entre Conjuntos de Caracteres Unicode de 3 e 4 Bytes”. Essa seção também descreve como converter tabelas do conjunto de caracteres `utf8mb3` (de 3 bytes) para o conjunto de caracteres `utf8mb4` (de 4 bytes) e quais restrições podem ser aplicadas ao fazer isso.

Um conjunto semelhante de ordenações está disponível para a maioria dos conjuntos de caracteres Unicode. Por exemplo, cada um tem uma ordenação dinamarquesa, cujos nomes são `utf8mb4_danish_ci`, `utf8mb3_danish_ci`, `utf8_danish_ci`, `ucs2_danish_ci`, `utf16_danish_ci` e `utf32_danish_ci`. A exceção é `utf16le`, que tem apenas duas ordenações. Para obter informações sobre as ordenações Unicode e suas propriedades diferenciadoras, incluindo propriedades de ordenação para caracteres suplementares, consulte a Seção 10.10.1, “Conjunto de Caracteres Unicode”.

A implementação do MySQL para UCS-2, UTF-16 e UTF-32 armazena caracteres na ordem de bytes big-endian e não usa uma marca de ordem de bytes (BOM) no início dos valores. Outros sistemas de banco de dados podem usar a ordem de bytes little-endian ou uma BOM. Nesses casos, a conversão dos valores deve ser realizada ao transferir dados entre esses sistemas e o MySQL. A implementação do UTF-16LE é little-endian.

O MySQL não usa BOM para valores UTF-8.

As aplicações cliente que se comunicam com o servidor usando Unicode devem definir o conjunto de caracteres do cliente de acordo (por exemplo, emitindo uma declaração `SET NAMES 'utf8mb4'`). Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET NAMES` ou `SET CHARACTER SET` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

As seções a seguir fornecem detalhes adicionais sobre os conjuntos de caracteres Unicode no MySQL.
