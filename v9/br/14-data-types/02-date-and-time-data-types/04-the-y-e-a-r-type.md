### 13.2.4 Tipo `YEAR`

O tipo `YEAR` é um tipo de 1 byte usado para representar valores de ano. Ele pode ser declarado como `YEAR` com uma largura de exibição implícita de 4 caracteres, ou, de forma equivalente, como `YEAR(4)` com uma largura de exibição explícita.

Observação

O tipo de dados `YEAR(4)` usando uma largura de exibição explícita está desatualizado e você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL. Em vez disso, use `YEAR` sem uma largura de exibição, o que tem o mesmo significado.

O MySQL exibe valores de `YEAR` no formato *`YYYY`*, com um intervalo de `1901` a `2155`, e `0000`.

`YEAR` aceita valores de entrada em uma variedade de formatos:

* Como strings de 4 dígitos no intervalo `'1901'` a `'2155'`.

* Como números de 4 dígitos no intervalo `1901` a `2155`.

* Como strings de 1 ou 2 dígitos no intervalo `'0'` a `'99'`. O MySQL converte valores nos intervalos `'0'` a `'69'` e `'70'` a `'99'` em valores de `YEAR` nos intervalos `2000` a `2069` e `1970` a `1999`.

* Como números de 1 ou 2 dígitos no intervalo `0` a `99`. O MySQL converte valores nos intervalos `1` a `69` e `70` a `99` em valores de `YEAR` nos intervalos `2001` a `2069` e `1970` a `1999`.

O resultado da inserção de um `0` numérico tem um valor de exibição de `0000` e um valor interno de `0000`. Para inserir zero e interpretá-lo como `2000`, especifique-o como uma string `'0'` ou `'00'`.

* Como o resultado de funções que retornam um valor aceitável no contexto de `YEAR`, como `NOW()`.

Se o modo SQL rigoroso não estiver habilitado, o MySQL converte valores `YEAR` inválidos em `0000`. No modo SQL rigoroso, tentar inserir um valor `YEAR` inválido produz um erro.

Veja também a Seção 13.2.9, “Anos de 2 dígitos em datas”.