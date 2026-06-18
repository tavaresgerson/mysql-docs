### 13.2.4 O Tipo ANO

O tipo `YEAR` é um tipo de 1 byte usado para representar valores de ano. Ele pode ser declarado como `YEAR` com uma largura de exibição implícita de 4 caracteres, ou, de forma equivalente, como `YEAR(4)` com uma largura de exibição explícita.

Nota

A partir do MySQL 8.0.19, o tipo de dados `YEAR(4)` com uma largura de exibição explícita está desatualizado e você deve esperar que o suporte a ele seja removido em uma versão futura do MySQL. Em vez disso, use `YEAR` sem uma largura de exibição, que tem o mesmo significado.

O MySQL 8.0 não suporta o tipo de dados de 2 dígitos `YEAR(2)` permitido em versões mais antigas do MySQL. Para obter instruções sobre a conversão para o tipo de dados de 4 dígitos `YEAR`, consulte Limitações do ANO(2) de 2 dígitos e Migração para ANO de 4 dígitos, no Manual de Referência do MySQL 5.7.

O MySQL exibe os valores `YEAR` no formato `YYYY`, com um intervalo de `1901` a `2155` e `0000`.

`YEAR` aceita valores de entrada em uma variedade de formatos:

- Como cadeias de 4 dígitos na faixa `'1901'` a `'2155'`.

- Como números de 4 dígitos na faixa `1901` a `2155`.

- Como cadeias de 1 ou 2 dígitos no intervalo `'0'` a `'99'`. O MySQL converte valores nos intervalos `'0'` a `'69'` e `'70'` a `'99'` para valores no intervalo `YEAR` nos intervalos `2000` a `2069` e `1970` a `1999`.

- Como números de 1 ou 2 dígitos na faixa `0` a `99`. O MySQL converte valores nas faixas `1` a `69` e `70` a `99` para valores na faixa `YEAR` nas faixas `2001` a `2069` e `1970` a `1999`.

  O resultado da inserção de um número `0` tem um valor de exibição de `0000` e um valor interno de `0000`. Para inserir zero e fazê-lo ser interpretado como `2000`, especifique-o como uma string `'0'` ou `'00'`.

- Como resultado de funções que retornam um valor aceitável no contexto `YEAR`, como `NOW()`.

Se o modo SQL rigoroso não estiver ativado, o MySQL converte valores inválidos de `YEAR` para `0000`. No modo SQL rigoroso, tentar inserir um valor inválido de `YEAR` produz um erro.

Veja também a Seção 13.2.9, “Anos de 2 dígitos em datas”.
