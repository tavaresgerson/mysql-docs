### 12.3.1 Convenções de Nomenclatura de Colisões

Os nomes das collation do MySQL seguem essas convenções:

- O nome de uma ordenação começa com o nome do conjunto de caracteres com o qual está associado, geralmente seguido por um ou mais sufixos que indicam outras características da ordenação. Por exemplo, `utf8mb4_0900_ai_ci` e `latin1_swedish_ci` são ordenações para os conjuntos de caracteres `utf8mb4` e `latin1`, respectivamente. O conjunto de caracteres `binary` tem uma única ordenação, também chamada de `binary`, sem sufixos.

- Uma ordenação específica para uma língua inclui um código de região ou nome da língua. Por exemplo, `utf8mb4_tr_0900_ai_ci` e `utf8mb4_hu_0900_ai_ci` ordenam caracteres para o conjunto de caracteres `utf8mb4` usando as regras do turco e do húngaro, respectivamente. `utf8mb4_turkish_ci` e `utf8mb4_hungarian_ci` são semelhantes, mas baseados em uma versão menos recente do Algoritmo de Ordenação Unicode.

- Os sufixos de ordenação indicam se uma ordenação é case-sensitive, accent-sensitive (sensível a acentos) ou kana-sensitive (sensível a kana) (ou alguma combinação dessas características), ou binária. A tabela a seguir mostra os sufixos usados para indicar essas características.

  **Tabela 12.1 Significados dos Sufixos de Collation**

  <table summary="Sufixos de comparação que indicam a sensibilidade à maiúscula, à acentuação, à kana e ao binário."><thead><tr> <th>Sufixo</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[<code>_ai</code>]]</td> <td>Sem acentuação</td> </tr><tr> <td>[[<code>_as</code>]]</td> <td>Sensibilidade ao sotaque</td> </tr><tr> <td>[[<code>_ci</code>]]</td> <td>Sem distinção de maiúsculas e minúsculas</td> </tr><tr> <td>[[<code>_cs</code>]]</td> <td>Case-sensitive</td> </tr><tr> <td>[[<code>_ks</code>]]</td> <td>Sensibilidade a kana</td> </tr><tr> <td>[[<code>_bin</code>]]</td> <td>Binário</td> </tr></tbody></table>

  Para nomes de ordenação não binários que não especificam a sensibilidade ao acento, é determinado pela sensibilidade de maiúsculas e minúsculas. Se um nome de ordenação não contém `_ai` ou `_as`, `_ci` no nome implica em `_ai` e `_cs` no nome implica em `_as`. Por exemplo, `latin1_general_ci` é explicitamente insensível a maiúsculas e minúsculas e implicitamente insensível ao acento, `latin1_general_cs` é explicitamente sensível a maiúsculas e minúsculas e implicitamente sensível ao acento, e `utf8mb4_0900_ai_ci` é explicitamente insensível a maiúsculas e minúsculas e ao acento.

  Para as ordenações japonesas, o sufixo `_ks` indica que uma ordenação é sensível ao kana; ou seja, distingue caracteres Katakana de caracteres Hiragana. Ordenações japonesas sem o sufixo `_ks` não são sensíveis ao kana e tratam caracteres Katakana e Hiragana como iguais para a ordenação.

  Para a concordância `binary` do conjunto de caracteres `binary`, as comparações são baseadas em valores numéricos de bytes. Para a concordância `_bin` de um conjunto de caracteres não binário, as comparações são baseadas em valores de código de caracteres numéricos, que diferem dos valores de bytes para caracteres multibyte. Para obter informações sobre as diferenças entre as concordâncias `binary` do conjunto de caracteres `binary` e as concordâncias `_bin` dos conjuntos de caracteres não binários, consulte a Seção 12.8.5, “A concordância binária em comparação com as concordâncias \_bin”.

- Os nomes das ordenações para conjuntos de caracteres Unicode podem incluir um número de versão para indicar a versão do Algoritmo de Ordenação Unicode (UCA) em que a ordenação se baseia. As ordenações baseadas no UCA sem um número de versão no nome usam as chaves de peso UCA versão 4.0.0. Por exemplo:

  - `utf8mb4_0900_ai_ci` é baseado nas chaves de peso da UCA 9.0.0 (<http://www.unicode.org/Public/UCA/9.0.0/allkeys.txt>).

  - `utf8mb4_unicode_520_ci` é baseado nas chaves de peso UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>).

  - `utf8mb4_unicode_ci` (sem versão nomeada) é baseado nas chaves de peso UCA 4.0.0 (<http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>).

- Para conjuntos de caracteres Unicode, as colatações `xxx_general_mysql500_ci` preservam a ordem pré-5.1.24 das colatações originais `xxx_general_ci` e permitem atualizações para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).
