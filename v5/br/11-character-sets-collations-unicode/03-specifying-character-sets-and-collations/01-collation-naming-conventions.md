### 10.3.1 Convenções de Nomenclatura de Collation

Os nomes de Collation do MySQL seguem estas convenções:

*   Um nome de Collation começa com o nome do *character set* ao qual está associado, geralmente seguido por um ou mais sufixos que indicam outras características da Collation. Por exemplo, `utf8_general_ci` e `latin1_swedish_ci` são Collations para os *character sets* `utf8` e `latin1`, respectivamente. O *character set* `binary` tem uma única Collation, também nomeada `binary`, sem sufixos.

*   Uma Collation específica de idioma inclui um nome de idioma. Por exemplo, `utf8_turkish_ci` e `utf8_hungarian_ci` ordenam caracteres para o *character set* `utf8` usando as regras do turco e do húngaro, respectivamente.

*   Os sufixos de Collation indicam se uma Collation diferencia maiúsculas/minúsculas (*case-sensitive*), diferencia acentuação (*accent-sensitive*), diferencia kana (*kana-sensitive*) (ou alguma combinação destes), ou se é binária. A tabela a seguir mostra os sufixos usados para indicar essas características.

  **Tabela 10.1 Significados dos Sufixos de Collation**

  | Sufixo | Significado |
  |---|---|
  | `_ai` | Não diferencia acentuação (*Accent-insensitive*) |
  | `_as` | Diferencia acentuação (*Accent-sensitive*) |
  | `_ci` | Não diferencia maiúsculas/minúsculas (*Case-insensitive*) |
  | `_cs` | Diferencia maiúsculas/minúsculas (*Case-sensitive*) |
  | `_bin` | Binário (*Binary*) |

  Para nomes de Collations não binárias que não especificam sensibilidade à acentuação (*accent sensitivity*), isso é determinado pela sensibilidade à caixa (*case sensitivity*). Se um nome de Collation não contém `_ai` ou `_as`, o `_ci` no nome implica `_ai` e o `_cs` no nome implica `_as`. Por exemplo, `latin1_general_ci` é explicitamente *case-insensitive* e implicitamente *accent-insensitive*, e `latin1_general_cs` é explicitamente *case-sensitive* e implicitamente *accent-sensitive*.

  Para a Collation `binary` do *character set* `binary`, as comparações são baseadas em valores de *byte* numéricos. Para a Collation `_bin` de um *character set* não binário, as comparações são baseadas em valores de código de caracteres numéricos, que diferem dos valores de *byte* para caracteres multibyte. Para obter informações sobre as diferenças entre a Collation `binary` do *character set* `binary` e as Collations `_bin` de *character sets* não binários, consulte a Seção 10.8.5, “Comparação entre a Collation binary e as Collations _bin”.

*   Nomes de Collation para *character sets* Unicode podem incluir um número de versão para indicar a versão do Unicode Collation Algorithm (UCA) na qual a Collation se baseia. Collations baseadas em UCA sem um número de versão no nome usam as chaves de peso UCA versão 4.0.0. Por exemplo:

    *   `utf8_unicode_520_ci` é baseada nas chaves de peso UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>).

    *   `utf8_unicode_ci` (sem versão nomeada) é baseada nas chaves de peso UCA 4.0.0 (<http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>).

*   Para *character sets* Unicode, as Collations `xxx_general_mysql500_ci` preservam a ordenação anterior à versão 5.1.24 das Collations `xxx_general_ci` originais e permitem *upgrades* para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).