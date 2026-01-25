### 10.3.1 Convenções de Nomenclatura de Collation

Os nomes de Collation do MySQL seguem estas convenções:

* Um nome de Collation começa com o nome do Conjunto de Caracteres ao qual está associado, geralmente seguido por um ou mais sufixos que indicam outras características da Collation. Por exemplo, `utf8_general_ci` e `latin1_swedish_ci` são Collations para os Conjuntos de Caracteres `utf8` e `latin1`, respectivamente. O Conjunto de Caracteres `binary` possui uma única Collation, também chamada `binary`, sem sufixos.

* Uma Collation específica de idioma inclui o nome de um idioma. Por exemplo, `utf8_turkish_ci` e `utf8_hungarian_ci` ordenam caracteres para o Conjunto de Caracteres `utf8` usando as regras do Turco e Húngaro, respectivamente.

* Os sufixos de Collation indicam se uma Collation é sensível a maiúsculas/minúsculas (case-sensitive), sensível a acentos (accent-sensitive) ou sensível a kana (kana-sensitive) (ou alguma combinação disso), ou binária. A tabela a seguir mostra os sufixos usados para indicar essas características.

  **Tabela 10.1 Significados dos Sufixos de Collation**

  <table summary="Sufixos de Collation que indicam sensibilidade a maiúsculas/minúsculas, sensibilidade a acentos, binário."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Sufixo</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>_ai</code></td> <td>Insensível a acentos (Accent-insensitive)</td> </tr><tr> <td><code>_as</code></td> <td>Sensível a acentos (Accent-sensitive)</td> </tr><tr> <td><code>_ci</code></td> <td>Insensível a maiúsculas/minúsculas (Case-insensitive)</td> </tr><tr> <td><code>_cs</code></td> <td>Sensível a maiúsculas/minúsculas (Case-sensitive)</td> </tr><tr> <td><code>_bin</code></td> <td>Binário (Binary)</td> </tr></tbody></table>

  Para nomes de Collations não binárias que não especificam sensibilidade a acentos, esta é determinada pela sensibilidade a maiúsculas/minúsculas. Se um nome de Collation não contiver `_ai` ou `_as`, `_ci` no nome implica `_ai`, e `_cs` no nome implica `_as`. Por exemplo, `latin1_general_ci` é explicitamente insensível a maiúsculas/minúsculas e implicitamente insensível a acentos, e `latin1_general_cs` é explicitamente sensível a maiúsculas/minúsculas e implicitamente sensível a acentos.

  Para a Collation `binary` do Conjunto de Caracteres `binary`, as comparações são baseadas em valores numéricos de byte. Para a Collation `_bin` de um Conjunto de Caracteres não binário, as comparações são baseadas em valores numéricos de código de caractere, que diferem dos valores de byte para caracteres multibyte. Para informações sobre as diferenças entre a Collation `binary` do Conjunto de Caracteres `binary` e as Collations `_bin` de Conjuntos de Caracteres não binários, consulte a Seção 10.8.5, “A Collation binary Comparada às Collations _bin”.

* Os nomes de Collation para Conjuntos de Caracteres Unicode podem incluir um número de versão para indicar a versão do Unicode Collation Algorithm (UCA) na qual a Collation se baseia. Collations baseadas em UCA sem um número de versão no nome usam as chaves de peso UCA da versão 4.0.0. Por exemplo:

  + `utf8_unicode_520_ci` é baseada nas chaves de peso UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>).

  + `utf8_unicode_ci` (sem versão nomeada) é baseada nas chaves de peso UCA 4.0.0 (<http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>).

* Para Conjuntos de Caracteres Unicode, as Collations `xxx_general_mysql500_ci` preservam a ordenação pré-5.1.24 das Collations `xxx_general_ci` originais e permitem upgrades para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).