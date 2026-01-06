#### 10.10.7.2 Conjunto de Caracteres gb18030

No MySQL, o conjunto de caracteres `gb18030` corresponde ao “Padrão Nacional Chinês GB 18030-2005: Tecnologia da informação — Conjunto de caracteres codificados chineses”, que é o conjunto de caracteres oficial da República Popular da China (RPC).

##### Características do conjunto de caracteres MySQL gb18030

- Suporta todos os pontos de código definidos pelo padrão GB 18030-2005. Os pontos de código não atribuídos nas faixas (GB+8431A439, GB+90308130) e (GB+E3329A36, GB+EF39EF39) são tratados como `?` (0x3F). A conversão de pontos de código não atribuídos retorna `?`.

- Suporta a conversão UPPER e LOWER para todos os pontos de código GB18030. O dobramento de maiúsculas definido pelo Unicode também é suportado (com base no `CaseFolding-6.3.0.txt`).

- Suporta a conversão de dados para e de outros conjuntos de caracteres.

- Suporta instruções SQL como `SET NAMES`.

- Suporta a comparação entre strings `gb18030` e entre strings `gb18030` e strings de outros conjuntos de caracteres. Há uma conversão se as strings tiverem conjuntos de caracteres diferentes. Comparativos que incluem ou ignoram espaços finais também são suportados.

- A área de uso privado (U+E000, U+F8FF) no Unicode é mapeada para `gb18030`.

- Não há mapeamento entre (U+D800, U+DFFF) e GB18030. A tentativa de conversão dos pontos de código nesta faixa retorna `?`.

- Se uma sequência de entrada for ilegal, um erro ou aviso é retornado. Se uma sequência ilegal for usada em `CONVERT()`, um erro é retornado. Caso contrário, um aviso é retornado.

- Para garantir a consistência com `utf8` e `utf8mb4`, a função UPPER não é suportada para ligaduras.

- As pesquisas por ligaduras também correspondem às ligaduras maiúsculas ao usar a collation `gb18030_unicode_520_ci`.

- Se um caractere tiver mais de um caractere maiúsculo, o caractere maiúsculo escolhido é aquele cujo caractere maiúsculo é o próprio caractere.

- O comprimento mínimo de multibytes é de 1 e o máximo é de 4. O conjunto de caracteres determina o comprimento de uma sequência usando os primeiros 1 ou 2 bytes.

##### Alimentos compatíveis

- `gb18030_bin`: Uma colagem binária.

- `gb18030_chinese_ci`: A collation padrão, que suporta o Pinyin. A ordenação de caracteres não chineses é baseada na ordem da chave de ordenação original. A chave de ordenação original é `GB(UPPER(ch))` se `UPPER(ch)` existir. Caso contrário, a chave de ordenação original é `GB(ch)`. Os caracteres chineses são ordenados de acordo com a collation Pinyin definida no Repositório de Dados de Local Comum Unicode (CLDR 24). Os caracteres não chineses são ordenados antes dos caracteres chineses, com exceção de `GB+FE39FE39`, que é o ponto máximo de código.

- `gb18030_unicode_520_ci`: Uma ordenação Unicode. Use esta ordenação se você precisar garantir que as ligaduras sejam ordenadas corretamente.
