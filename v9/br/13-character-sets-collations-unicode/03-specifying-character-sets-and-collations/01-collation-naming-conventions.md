### 12.3.1 Convenções de Nomenclatura de Cotações

Os nomes das cotas MySQL seguem estas convenções:

* O nome de uma cotação começa com o nome do conjunto de caracteres com o qual está associado, geralmente seguido por um ou mais sufixos que indicam outras características da cotação. Por exemplo, `utf8mb4_0900_ai_ci` e `latin1_swedish_ci` são cotas para os conjuntos de caracteres `utf8mb4` e `latin1`, respectivamente. O conjunto de caracteres `binary` tem uma única cotação, também chamada `binary`, sem sufixos.

* Uma cotação específica de uma língua inclui um código de região ou nome de língua. Por exemplo, `utf8mb4_tr_0900_ai_ci` e `utf8mb4_hu_0900_ai_ci` ordenam caracteres para o conjunto de caracteres `utf8mb4` usando as regras do turco e do húngaro, respectivamente. `utf8mb4_turkish_ci` e `utf8mb4_hungarian_ci` são semelhantes, mas baseadas em uma versão menos recente do Algoritmo de Cotações Unicode.

* Os sufixos de cotação indicam se uma cotação é sensível a maiúsculas, acentos ou kana (ou alguma combinação desses), ou binária. A tabela a seguir mostra os sufixos usados para indicar essas características.

**Tabela 12.1 Significados dos Sufixos de Cotação**

<table summary="Sufixos de ordenação que indicam a sensibilidade à maiúscula e minúscula, ao acento, ao kana e ao binário."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Sufixo</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>_ai</code></td> <td>Insensível ao acento</td> </tr><tr> <td><code>_as</code></td> <td>Sensibilidade ao acento</td> </tr><tr> <td><code>_ci</code></td> <td>Insensível à maiúscula e minúscula</td> </tr><tr> <td><code>_cs</code></td> <td>Sensibilidade à maiúscula e minúscula</td> </tr><tr> <td><code>_ks</code></td> <td>Sensibilidade ao kana</td> </tr><tr> <td><code>_bin</code></td> <td>Binário</td> </tr></tbody></table>

  Para nomes de ordenação não binários que não especificam a sensibilidade ao acento, é determinado pela sensibilidade à maiúscula e minúscula. Se um nome de ordenação não contém `_ai` ou `_as`, `_ci` no nome implica `_ai` e `_cs` no nome implica `_as`. Por exemplo, `latin1_general_ci` é explicitamente insensível à maiúscula e minúscula e implicitamente insensível ao acento, `latin1_general_cs` é explicitamente sensível à maiúscula e minúscula e implicitamente sensível ao acento, e `utf8mb4_0900_ai_ci` é explicitamente insensível à maiúscula e minúscula e ao acento.

  Para ordenações japonesas, o sufixo `_ks` indica que uma ordenação é sensível ao kana; ou seja, distingue caracteres Katakana de caracteres Hiragana. Ordenações japonesas sem o sufixo `_ks` não são sensíveis ao kana e tratam caracteres Katakana e Hiragana como iguais para a ordenação.

Para a ordenação `binary` do conjunto de caracteres `binary`, as comparações são baseadas em valores numéricos de bytes. Para a ordenação `_bin` de um conjunto de caracteres não binário, as comparações são baseadas em valores de código de caracteres numéricos, que diferem dos valores de byte para caracteres multibyte. Para obter informações sobre as diferenças entre a ordenação `binary` do conjunto de caracteres `binary` e as ordenações `_bin` de conjuntos de caracteres não binários, consulte a Seção 12.8.5, “A ordenação binária comparada às ordenações \_bin”.

* Os nomes das ordenações para conjuntos de caracteres Unicode podem incluir um número de versão para indicar a versão do Algoritmo de Ordenação Unicode (UCA) em que a ordenação é baseada. Ordenações baseadas no UCA sem número de versão no nome usam as chaves de peso UCA-4.0.0. Por exemplo:

  + `utf8mb4_0900_ai_ci` é baseado nas chaves de peso UCA 9.0.0 (<http://www.unicode.org/Public/UCA/9.0.0/allkeys.txt>).

  + `utf8mb4_unicode_520_ci` é baseado nas chaves de peso UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>).

  + `utf8mb4_unicode_ci` (sem versão nomeada) é baseado nas chaves de peso UCA 4.0.0 (<http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>).

* Para conjuntos de caracteres Unicode, as ordenações `xxx_general_mysql500_ci` preservam a ordem pré-5.1.24 das ordenações originais `xxx_general_ci` e permitem atualizações para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).