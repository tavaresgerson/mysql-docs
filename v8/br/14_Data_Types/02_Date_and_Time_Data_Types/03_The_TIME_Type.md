### 13.2.3 O Tipo TIME

O MySQL recupera e exibe os valores de `TIME` no formato `'hh:mm:ss'` (ou no formato `'hhh:mm:ss'` para valores de horas grandes). Os valores de `TIME` podem variar de `'-838:59:59'` a `'838:59:59'`. A parte das horas pode ser tão grande porque o tipo `TIME` pode ser usado não apenas para representar uma hora do dia (que deve ser menor que 24 horas), mas também para representar tempo decorrido ou um intervalo de tempo entre dois eventos (que pode ser muito maior que 24 horas, ou até mesmo negativo).

O MySQL reconhece os valores `TIME` em vários formatos, alguns dos quais podem incluir uma parte fracionária de segundos em até microsegundos (6 dígitos) de precisão. Veja a Seção 11.1.3, “Literais de Data e Hora”. Para informações sobre o suporte a frações de segundos no MySQL, consulte a Seção 13.2.6, “Frações de Segundo em Valores de Hora”. Em particular, qualquer parte fracionária em um valor inserido em uma coluna `TIME` é armazenada em vez de ser descartada. Com a parte fracionária incluída, a faixa para os valores `TIME` é de `'-838:59:59.000000'` a `'838:59:59.000000'`.

Tenha cuidado ao atribuir valores abreviados a uma coluna `TIME`. O MySQL interpreta valores abreviados com dois pontos após o `TIME` como hora do dia. Ou seja, `'11:12'` significa `'11:12:00'`, não `'00:11:12'`. O MySQL interpreta valores abreviados sem dois pontos, assumindo que os dois dígitos mais à direita representam segundos (ou seja, como tempo decorrido, e não como hora do dia). Por exemplo, você pode pensar que `'1112'` e `1112` significam `'11:12:00'` (12 minutos após as 11 horas), mas o MySQL os interpreta como `'00:11:12'` (11 minutos e 12 segundos). Da mesma forma, `'12'` e `12` são interpretados como `'00:00:12'`.

O único delimitador reconhecido entre uma parte de tempo e uma parte de segundos fracionários é o ponto decimal.

Por padrão, os valores que estão fora da faixa `TIME`, mas que são válidos de outra forma, são recortados para o ponto final mais próximo da faixa. Por exemplo, `'-850:00:00'` e `'850:00:00'` são convertidos para `'-838:59:59'` e `'838:59:59'`. Valores inválidos de `TIME` são convertidos para `'00:00:00'`. Observe que, como `'00:00:00'` é ele mesmo um valor válido de `TIME`, não há como saber, a partir de um valor de `'00:00:00'` armazenado em uma tabela, se o valor original foi especificado como `'00:00:00'` ou se era inválido.

Para um tratamento mais restritivo de valores inválidos do `TIME`, habilite o modo SQL rigoroso para que ocorram erros. Consulte a Seção 7.1.11, “Modos SQL do Servidor”.
