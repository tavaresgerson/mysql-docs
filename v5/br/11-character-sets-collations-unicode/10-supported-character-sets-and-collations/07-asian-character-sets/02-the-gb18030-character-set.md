#### 10.10.7.2 O Conjunto de Caracteres gb18030

No MySQL, o conjunto de caracteres `gb18030` corresponde ao “Padrão Nacional Chinês GB 18030-2005: Tecnologia da informação – Conjunto de caracteres codificados chinês”, que é o conjunto de caracteres oficial da República Popular da China (RPC).

##### Características do Conjunto de Caracteres gb18030 do MySQL

* Suporta todos os *code points* definidos pelo padrão GB 18030-2005. *Code points* não atribuídos nos intervalos (GB+8431A439, GB+90308130) e (GB+E3329A36, GB+EF39EF39) são tratados como '`?`' (0x3F). A conversão de *code points* não atribuídos retorna '`?`'.

* Suporta conversão UPPER e LOWER para todos os *code points* GB18030. O *Case folding* definido pelo Unicode também é suportado (baseado em `CaseFolding-6.3.0.txt`).

* Suporta a conversão de dados de e para outros *character sets*.

* Suporta comandos SQL como `SET NAMES`.

* Suporta comparação entre *strings* `gb18030` e entre *strings* `gb18030` e *strings* de outros *character sets*. Ocorre uma conversão se as *strings* tiverem *character sets* diferentes. Comparações que incluem ou ignoram espaços em branco finais (*trailing spaces*) também são suportadas.

* A área de uso privado (*private use area*) (U+E000, U+F8FF) no Unicode é mapeada para `gb18030`.

* Não há mapeamento entre (U+D800, U+DFFF) e GB18030. Tentativas de conversão de *code points* neste intervalo retornam '`?`'.

* Se uma sequência de entrada for ilegal, um *error* ou *warning* é retornado. Se uma sequência ilegal for usada em `CONVERT()`, um *error* é retornado. Caso contrário, um *warning* é retornado.

* Para manter a consistência com `utf8` e `utf8mb4`, o UPPER não é suportado para ligaturas.

* Buscas por ligaturas também correspondem a ligaturas maiúsculas ao usar a *collation* `gb18030_unicode_520_ci`.

* Se um caractere tiver mais de um caractere maiúsculo, o caractere maiúsculo escolhido é aquele cuja minúscula é o próprio caractere.

* O comprimento mínimo multibyte é 1 e o máximo é 4. O *character set* determina o comprimento de uma sequência usando o primeiro 1 ou 2 bytes.

##### Collations Suportadas

* `gb18030_bin`: Uma *collation* binária.
* `gb18030_chinese_ci`: A *collation* padrão, que suporta Pinyin. A ordenação de caracteres não chineses é baseada na ordem da *sort key* original. A *sort key* original é `GB(UPPER(ch))` se `UPPER(ch)` existir. Caso contrário, a *sort key* original é `GB(ch)`. Os caracteres chineses são ordenados de acordo com a *collation* Pinyin definida no Repositório de Dados de Localidade Comum Unicode (*Unicode Common Locale Data Repository* - CLDR 24). Caracteres não chineses são ordenados antes dos caracteres chineses, com exceção de `GB+FE39FE39`, que é o máximo *code point*.

* `gb18030_unicode_520_ci`: Uma *collation* Unicode. Use esta *collation* se precisar garantir que as ligaturas sejam ordenadas corretamente.