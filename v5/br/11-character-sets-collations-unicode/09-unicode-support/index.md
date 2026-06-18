## 10.9 Suporte a Unicode

10.9.1 O Conjunto de Caracteres utf8mb4 (Codificação UTF-8 Unicode de 4 Bytes)

10.9.2 O Conjunto de Caracteres utf8mb3 (Codificação UTF-8 Unicode de 3 Bytes)

10.9.3 O Conjunto de Caracteres utf8 (Alias para utf8mb3)

10.9.4 O Conjunto de Caracteres ucs2 (Codificação UCS-2 Unicode)

10.9.5 O Conjunto de Caracteres utf16 (Codificação UTF-16 Unicode)

10.9.6 O Conjunto de Caracteres utf16le (Codificação UTF-16LE Unicode)

10.9.7 O Conjunto de Caracteres utf32 (Codificação UTF-32 Unicode)

10.9.8 Conversão Entre Conjuntos de Caracteres Unicode de 3 Bytes e 4 Bytes

O Padrão Unicode inclui caracteres do Plano Multilíngue Básico (*Basic Multilingual Plane* - BMP) e caracteres suplementares que se encontram fora do BMP. Esta seção descreve o suporte a Unicode no MySQL. Para obter informações sobre o próprio Padrão Unicode, visite o site do Consórcio Unicode.

Caracteres BMP têm estas características:

* Seus valores de *Code Point* estão entre 0 e 65535 (ou `U+0000` e `U+FFFF`).

* Eles podem ser codificados em uma codificação de comprimento variável usando 8, 16 ou 24 bits (1 a 3 bytes).

* Eles podem ser codificados em uma codificação de comprimento fixo usando 16 bits (2 bytes).

* Eles são suficientes para quase todos os caracteres em idiomas principais.

Caracteres suplementares estão fora do BMP:

* Seus valores de *Code Point* estão entre `U+10000` e `U+10FFFF`).

* O suporte a Unicode para caracteres suplementares requer conjuntos de caracteres que tenham um intervalo fora dos caracteres BMP e, portanto, ocupam mais espaço do que os caracteres BMP (até 4 bytes por caractere).

O método UTF-8 (*Unicode Transformation Format with 8-bit units*) para codificar dados Unicode é implementado de acordo com a RFC 3629, que descreve sequências de codificação que utilizam de um a quatro bytes. A ideia do UTF-8 é que vários caracteres Unicode sejam codificados usando sequências de bytes de diferentes comprimentos:

* Letras latinas básicas, dígitos e sinais de pontuação usam um byte.

* A maioria das letras de escritas europeias e do Oriente Médio se encaixam em uma sequência de 2 bytes: letras latinas estendidas (com til, mácron, acento agudo, acento grave e outros acentos), cirílico, grego, armênio, hebraico, árabe, siríaco e outros.

* Ideogramas coreanos, chineses e japoneses usam sequências de 3 ou 4 bytes.

O MySQL suporta os seguintes conjuntos de caracteres Unicode:

* `utf8mb4`: Uma codificação UTF-8 do conjunto de caracteres Unicode usando de um a quatro bytes por caractere.

* `utf8mb3`: Uma codificação UTF-8 do conjunto de caracteres Unicode usando de um a três bytes por caractere.

* `utf8`: Um alias para `utf8mb3`.

* `ucs2`: A codificação UCS-2 do conjunto de caracteres Unicode usando dois bytes por caractere.

* `utf16`: A codificação UTF-16 para o conjunto de caracteres Unicode usando dois ou quatro bytes por caractere. Semelhante ao `ucs2`, mas com uma extensão para caracteres suplementares.

* `utf16le`: A codificação UTF-16LE para o conjunto de caracteres Unicode. Semelhante ao `utf16`, mas *little-endian* em vez de *big-endian*.

* `utf32`: A codificação UTF-32 para o conjunto de caracteres Unicode usando quatro bytes por caractere.

A Tabela 10.2, “Características Gerais do Conjunto de Caracteres Unicode”, resume as características gerais dos conjuntos de caracteres Unicode suportados pelo MySQL.

**Tabela 10.2 Características Gerais do Conjunto de Caracteres Unicode**

| Conjunto de Caracteres | Caracteres Suportados | Armazenamento Necessário Por Caractere |
| :--- | :--- | :--- |
| `utf8mb3`, `utf8` | Apenas BMP | 1, 2 ou 3 bytes |
| `ucs2` | Apenas BMP | 2 bytes |
| `utf8mb4` | BMP e suplementares | 1, 2, 3 ou 4 bytes |
| `utf16` | BMP e suplementares | 2 ou 4 bytes |
| `utf16le` | BMP e suplementares | 2 ou 4 bytes |
| `utf32` | BMP e suplementares | 4 bytes |

Caracteres fora do BMP são comparados como CARACTERE DE SUBSTITUIÇÃO (*REPLACEMENT CHARACTER*) e são convertidos para `'?'` quando convertidos para um conjunto de caracteres Unicode que suporta apenas caracteres BMP (`utf8mb3` ou `ucs2`).

Se você usar conjuntos de caracteres que suportam caracteres suplementares e, portanto, são "mais amplos" do que os conjuntos de caracteres `utf8mb3` e `ucs2` (somente BMP), há potenciais problemas de incompatibilidade para suas aplicações; consulte a Seção 10.9.8, “Conversão Entre Conjuntos de Caracteres Unicode de 3 Bytes e 4 Bytes”. Essa seção também descreve como converter tabelas de `utf8mb3` (3 bytes) para `utf8mb4` (4 bytes) e quais restrições podem ser aplicadas ao fazer isso.

Um conjunto semelhante de agrupamentos (*collations*) está disponível para a maioria dos conjuntos de caracteres Unicode. Por exemplo, cada um tem um agrupamento dinamarquês, cujos nomes são `utf8mb4_danish_ci`, `utf8mb3_danish_ci`, `utf8_danish_ci`, `ucs2_danish_ci`, `utf16_danish_ci` e `utf32_danish_ci`. A exceção é `utf16le`, que possui apenas dois agrupamentos. Para obter informações sobre agrupamentos Unicode e suas propriedades distintivas, incluindo propriedades de agrupamento para caracteres suplementares, consulte a Seção 10.10.1, “Conjuntos de Caracteres Unicode”.

A implementação do MySQL de UCS-2, UTF-16 e UTF-32 armazena caracteres na ordem de bytes *big-endian* e não usa uma marca de ordem de bytes (*byte order mark* - BOM) no início dos valores. Outros sistemas de *Database* podem usar ordem de bytes *little-endian* ou um BOM. Nesses casos, a conversão de valores deve ser realizada ao transferir dados entre esses sistemas e o MySQL. A implementação do UTF-16LE é *little-endian*.

O MySQL não usa BOM para valores UTF-8.

Aplicações *Client* que se comunicam com o *server* usando Unicode devem configurar o conjunto de caracteres do *client* de acordo (por exemplo, emitindo uma instrução `SET NAMES 'utf8mb4'`). Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do *client*. A tentativa de usá-los com `SET NAMES` ou `SET CHARACTER SET` produz um erro. Consulte Conjuntos de Caracteres de Cliente Não Permitidos.

As seções a seguir fornecem detalhes adicionais sobre os conjuntos de caracteres Unicode no MySQL.
