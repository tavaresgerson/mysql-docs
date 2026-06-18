### 11.2.4 O Tipo YEAR

O tipo `YEAR` é um tipo de 1 byte usado para representar valores de ano. Ele pode ser declarado como `YEAR` com uma largura de exibição (display width) implícita de 4 caracteres, ou de forma equivalente como `YEAR(4)` com uma largura de exibição explícita.

Nota

O tipo de dados `YEAR(2)` de 2 dígitos está obsoleto (deprecated) e o suporte a ele foi removido no MySQL 5.7.5. Para converter colunas `YEAR(2)` de 2 dígitos para colunas `YEAR` de 4 dígitos, consulte a Seção 11.2.5, "Limitações de YEAR(2) de 2 Dígitos e Migração para YEAR de 4 Dígitos" (2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR").

O MySQL exibe valores `YEAR` no formato *`YYYY`*, com um intervalo de `1901` a `2155`, e `0000`.

`YEAR` aceita valores de entrada em uma variedade de formatos:

* Como strings de 4 dígitos no intervalo de `'1901'` a `'2155'`.

* Como números de 4 dígitos no intervalo de `1901` a `2155`.

* Como strings de 1 ou 2 dígitos no intervalo de `'0'` a `'99'`. O MySQL converte valores nos intervalos de `'0'` a `'69'` e `'70'` a `'99'` para valores `YEAR` nos intervalos de `2000` a `2069` e `1970` a `1999`.

* Como números de 1 ou 2 dígitos no intervalo de `0` a `99`. O MySQL converte valores nos intervalos de `1` a `69` e `70` a `99` para valores `YEAR` nos intervalos de `2001` a `2069` e `1970` a `1999`.

  O resultado da inserção de um `0` numérico tem um valor de exibição de `0000` e um valor interno de `0000`. Para inserir zero e fazer com que seja interpretado como `2000`, especifique-o como uma string `'0'` ou `'00'`.

* Como resultado de funções que retornam um valor aceitável no contexto `YEAR`, como `NOW()`.

Se o modo strict SQL não estiver habilitado, o MySQL converte valores `YEAR` inválidos para `0000`. No modo strict SQL, a tentativa de inserir um valor `YEAR` inválido gera um erro.

Consulte também a Seção 11.2.10, "Anos de 2 Dígitos em Datas" (2-Digit Years in Dates).