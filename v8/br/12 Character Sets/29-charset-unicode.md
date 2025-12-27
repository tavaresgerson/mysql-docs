## Suporte Unicode

O Padrão Unicode inclui caracteres do Plano Multilíngue Básico (BMP) e caracteres suplementares que estão fora do BMP. Esta seção descreve o suporte para Unicode no MySQL. Para informações sobre o próprio Padrão Unicode, visite o site do Unicode Consortium.

Os caracteres do BMP têm essas características:

* Seus valores de ponto de código estão entre 0 e 65535 (ou `U+0000` e `U+FFFF`).
* Eles podem ser codificados em uma codificação de comprimento variável usando 8, 16 ou 24 bits (1 a 3 bytes).
* Eles podem ser codificados em uma codificação de comprimento fixo usando 16 bits (2 bytes).
* Eles são suficientes para quase todos os caracteres das principais línguas.

Os caracteres suplementares estão fora do BMP:

* Seus valores de ponto de código estão entre `U+10000` e `U+10FFFF`).
* O suporte Unicode para caracteres suplementares requer conjuntos de caracteres que têm um intervalo fora dos caracteres do BMP e, portanto, ocupam mais espaço do que os caracteres do BMP (até 4 bytes por caractere).

O método UTF-8 (Formato de Transformação Unicode com Unidades de 8 bits) para codificação de dados Unicode é implementado de acordo com o RFC 3629, que descreve sequências de codificação que ocupam de um a quatro bytes. A ideia do UTF-8 é que vários caracteres Unicode são codificados usando sequências de bytes de diferentes comprimentos:

* Letras latinas básicas, dígitos e sinais de pontuação usam um byte.
* A maioria das letras de scripts europeus e do Oriente Médio cabem em uma sequência de 2 bytes: letras latinas estendidas (com tilde, macron, acentuado, grave e outros acentos), cirílico, grego, armênio, hebraico, árabe, siríaco e outros.
* Ideogramas coreano, chinês e japonês usam sequências de 3 ou 4 bytes.

O MySQL suporta esses conjuntos de caracteres Unicode:

* `utf8mb4`: Uma codificação UTF-8 do conjunto de caracteres Unicode usando de um a quatro bytes por caractere.
* `utf8mb3`: Uma codificação UTF-8 do conjunto de caracteres Unicode usando de um a três bytes por caractere. Este conjunto de caracteres está desatualizado e sujeito à remoção em uma futura versão; use `utf8mb4` em vez disso.
* `utf8`: Um alias desatualizado para `utf8mb3`; use `utf8mb4` em vez disso.

::: info Nota

`utf8` é esperado que, em uma futura versão do MySQL, se torne um alias para `utf8mb4`.


:::
* `ucs2`: A codificação UCS-2 do conjunto de caracteres Unicode usando dois bytes por caractere. Desatualizado; espere que o suporte a este conjunto de caracteres seja removido em uma futura versão.
* `utf16`: A codificação UTF-16 para o conjunto de caracteres Unicode usando dois ou quatro bytes por caractere. Como `ucs2`, mas com uma extensão para caracteres suplementares.
* `utf16le`: A codificação UTF-16LE para o conjunto de caracteres Unicode. Como `utf16`, mas little-endian em vez de big-endian.
* `utf32`: A codificação UTF-32 para o conjunto de caracteres Unicode usando quatro bytes por caractere. ::: info Nota

O conjunto de caracteres `utf8mb3` está desatualizado e você deve esperar que ele seja removido em uma futura versão do MySQL. Por favor, use `utf8mb4` em vez disso. `utf8` é atualmente um alias para `utf8mb3`, mas agora está desatualizado como tal, e `utf8` é esperado que, posteriormente, se torne uma referência para `utf8mb4`. O MySQL 8.4 também exibe `utf8mb3` no lugar de `utf8` nas colunas das tabelas do Schema de Informações e na saída das declarações `SHOW` do SQL.

Além disso, você deve estar ciente de que as colorações que usam o prefixo `utf8_` em versões mais antigas do MySQL foram renomeadas para o prefixo `utf8mb3_`, em vez disso.

Para evitar ambiguidade sobre o significado de `utf8`, considere especificar `utf8mb4` explicitamente para referências de conjuntos de caracteres.


:::

 A Tabela 12.2, “Características Gerais do Conjunto de Caracteres Unicode”, resume as características gerais dos conjuntos de caracteres Unicode suportados pelo MySQL.

**Tabela 12.2 Características Gerais do Conjunto de Caracteres Unicode**

<table><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Conjunto de Caracteres</th> <th>Caracteres Suportado</th> <th>Armazenamento Requerido por Caractere</th> </tr></thead><tbody><tr> <th><code>utf8mb3</code>, <code>utf8</code> (desatualizado)</th> <td>Apenas BMP</td> <td>1, 2 ou 3 bytes</td> </tr><tr> <th><code>ucs2</code></th> <td>Apenas BMP</td> <td>2 bytes</td> </tr><tr> <th><code>utf8mb4</code></th> <td>BMP e suplementar</td> <td>1, 2, 3 ou 4 bytes</td> </tr><tr> <th><code>utf16</code></th> <td>BMP e suplementar</td> <td>2 ou 4 bytes</td> </tr><tr> <th><code>utf16le</code></th> <td>BMP e suplementar</td> <td>2 ou 4 bytes</td> </tr><tr> <th><code>utf32</code></th> <td>BMP e suplementar</td> <td>4 bytes</td> </tr></tbody></table>

Caracteres fora do BMP são comparados como `CARACTERE DE REPLICAÇÃO` e convertidos para `'?'` quando convertidos para um conjunto de caracteres Unicode que suporta apenas caracteres do BMP (`utf8mb3` ou `ucs2`).

Se você usar conjuntos de caracteres que suportam caracteres suplementares e, portanto, são “mais amplos” do que os conjuntos de caracteres `utf8mb3` e `ucs2`, que suportam apenas o BMP, há potenciais problemas de incompatibilidade para suas aplicações; consulte  Seção 12.9.8, “Conversão entre Conjuntos de Caracteres Unicode de 3 Bytes e 4 Bytes”. Essa seção também descreve como converter tabelas do `utf8mb3` (3 bytes) para o `utf8mb4` (4 bytes) e quais restrições podem ser aplicadas ao fazer isso.

Um conjunto semelhante de ordenações está disponível para a maioria dos conjuntos de caracteres Unicode. Por exemplo, cada um tem uma ordenação dinamarquesa, cujos nomes são `utf8mb4_danish_ci`, `utf8mb3_danish_ci` (desatualizado), `utf8_danish_ci` (desatualizado), `ucs2_danish_ci`, `utf16_danish_ci` e `utf32_danish_ci`. A exceção é `utf16le`, que tem apenas duas ordenações. Para informações sobre ordenações Unicode e suas propriedades diferenciadoras, incluindo propriedades de ordenação para caracteres suplementares, consulte  Seção 12.10.1, “Conjuntos de Caracteres Unicode”.

A implementação do MySQL para UCS-2, UTF-16 e UTF-32 armazena caracteres na ordem de bytes big-endian e não usa uma marca de ordem de bytes (BOM) no início dos valores. Outros sistemas de banco de dados podem usar a ordem de bytes little-endian ou uma BOM. Nesses casos, a conversão dos valores precisa ser realizada ao transferir dados entre esses sistemas e o MySQL. A implementação do UTF-16LE é little-endian.

O MySQL não usa BOM para valores UTF-8.

Aplicativos cliente que se comunicam com o servidor usando Unicode devem definir o conjunto de caracteres do cliente de acordo (por exemplo, emitindo uma declaração `SET NAMES 'utf8mb4'`). Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET NAMES` ou `SET CHARACTER SET` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

As seções a seguir fornecem detalhes adicionais sobre os conjuntos de caracteres Unicode no MySQL.