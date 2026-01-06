### 11.2.4 O Tipo ANO

O tipo `YEAR` é um tipo de 1 byte usado para representar valores de ano. Ele pode ser declarado como `YEAR` com uma largura de exibição implícita de 4 caracteres, ou, de forma equivalente, como `YEAR(4)` com uma largura de exibição explícita.

Nota

O tipo de dados `YEAR(2)` de 2 dígitos está desatualizado e o suporte a ele foi removido no MySQL 5.7.5. Para converter colunas `YEAR(2)` de 2 dígitos em colunas `YEAR` de 4 dígitos, consulte a Seção 11.2.5, “Limitações do 2-Digit YEAR(2) e Migração para YEAR de 4 Dígitos” e “Limitações e Migração para YEAR de 4 Dígitos”).

O MySQL exibe os valores de `YEAR` no formato *`YYYY`*, com um intervalo de `1901` a `2155` e `0000`.

`YEAR` aceita valores de entrada em uma variedade de formatos:

- Como cadeias de 4 dígitos no intervalo `'1901'` a `'2155'`.

- Como números de 4 dígitos na faixa de `1901` a `2155`.

- Como cadeias de 1 ou 2 dígitos no intervalo `'0'` a `'99'`. O MySQL converte valores nos intervalos `'0'` a `'69'` e `'70'` a `'99'` em valores `YEAR` nos intervalos `2000` a `2069` e `1970` a `1999`.

- Como números de 1 ou 2 dígitos no intervalo de `0` a `99`. O MySQL converte valores nos intervalos de `1` a `69` e `70` a `99` em valores `YEAR` nos intervalos de `2001` a `2069` e `1970` a `1999`.

  O resultado da inserção de um `0` numérico tem um valor de exibição de `0000` e um valor interno de `0000`. Para inserir zero e fazê-lo ser interpretado como `2000`, especifique-o como uma string `'0'` ou `'00'`.

- Como resultado de funções que retornam um valor aceitável no contexto `YEAR`, como `NOW()`.

Se o modo SQL rigoroso não estiver habilitado, o MySQL converte valores `YEAR` inválidos em `0000`. No modo SQL rigoroso, tentar inserir um valor `YEAR` inválido produz um erro.

Veja também a Seção 11.2.10, “Anos de 2 dígitos em datas”.
