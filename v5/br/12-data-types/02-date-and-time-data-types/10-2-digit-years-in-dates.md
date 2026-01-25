### 11.2.10 Anos de 2 Dígitos em Datas

Valores de data com anos de 2 dígitos são ambíguos porque o século é desconhecido. Tais valores devem ser interpretados na forma de 4 dígitos, pois o MySQL armazena anos internamente usando 4 dígitos.

Para os tipos `DATETIME`, `DATE` e `TIMESTAMP`, o MySQL interpreta datas especificadas com valores de ano ambíguos usando estas regras:

* Valores de ano no intervalo de `00-69` tornam-se `2000-2069`.

* Valores de ano no intervalo de `70-99` tornam-se `1970-1999`.

Para o tipo `YEAR`, as regras são as mesmas, com esta exceção: Um `00` numérico inserido em `YEAR` resulta em `0000` em vez de `2000`. Para especificar zero para `YEAR` e fazer com que seja interpretado como `2000`, especifique-o como uma string `'0'` ou `'00'`.

Lembre-se de que estas regras são apenas heurísticas que fornecem estimativas razoáveis sobre o significado dos seus valores de dados. Se as regras usadas pelo MySQL não produzirem os valores que você precisa, você deve fornecer uma entrada não ambígua contendo valores de ano de 4 dígitos.

O `ORDER BY` classifica corretamente os valores `YEAR` que possuem anos de 2 dígitos.

Algumas funções como `MIN()` e `MAX()` convertem um `YEAR` para um número. Isso significa que um valor com ano de 2 dígitos não funciona corretamente com estas funções. A solução neste caso é converter o `YEAR` para o formato de ano de 4 dígitos.