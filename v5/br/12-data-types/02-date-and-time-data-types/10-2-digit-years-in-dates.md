### 11.2.10 Anos de 2 dígitos nas datas

Os valores de data com anos de 2 dígitos são ambíguos porque o século é desconhecido. Esses valores devem ser interpretados na forma de 4 dígitos, pois o MySQL armazena os anos internamente usando 4 dígitos.

Para os tipos `DATETIME`, `DATE` e `TIMESTAMP`, o MySQL interpreta as datas especificadas com valores de ano ambíguos usando essas regras:

- Os valores do ano na faixa `00-69` se tornam `2000-2069`.

- Os valores do ano na faixa `70-99` se tornam `1970-1999`.

Para `YEAR`, as regras são as mesmas, com esta exceção: um `00` numérico inserido em `YEAR` resulta em `0000` em vez de `2000`. Para especificar zero para `YEAR` e interpretá-lo como `2000`, especifique-o como uma string `'0'` ou `'00'`.

Lembre-se de que essas regras são apenas heurísticas que fornecem suposições razoáveis sobre o que significam os valores dos seus dados. Se as regras usadas pelo MySQL não produzirem os valores que você deseja, você deve fornecer uma entrada inequívoca contendo valores de ano de 4 dígitos.

A cláusula `ORDER BY` ordena corretamente os valores `YEAR` que têm anos de 2 dígitos.

Algumas funções, como `MIN()` e `MAX()`, convertem um `YEAR` em um número. Isso significa que um valor com um ano de 2 dígitos não funciona corretamente com essas funções. A solução para esse caso é converter o `YEAR` para o formato de ano de 4 dígitos.
