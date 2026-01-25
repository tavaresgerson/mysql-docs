## 11.2 Tipos de Dados de Data e Hora

11.2.1 Sintaxe do Tipo de Dados de Data e Hora

11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP

11.2.3 O Tipo TIME

11.2.4 O Tipo YEAR

11.2.5 Limitações de YEAR(2) com 2 Dígitos e Migração para YEAR com 4 Dígitos

11.2.6 Inicialização e Atualização Automática para TIMESTAMP e DATETIME

11.2.7 Segundos Fracionários em Valores de Tempo

11.2.8 Qual Calendário é Usado pelo MySQL?

11.2.9 Conversão Entre Tipos de Data e Hora

11.2.10 Anos com 2 Dígitos em Datas

Os tipos de dados de data e hora para representar valores temporais são `DATE`, `TIME`, `DATETIME`, `TIMESTAMP` e `YEAR`. Cada tipo temporal possui um intervalo de valores válidos, bem como um valor “zero” que pode ser usado quando você especifica um valor inválido que o MySQL não pode representar. Os tipos `TIMESTAMP` e `DATETIME` possuem um comportamento especial de atualização automática, descrito na Seção 11.2.6, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

Para informações sobre os requisitos de armazenamento dos tipos de dados temporais, veja a Seção 11.7, “Requisitos de Armazenamento de Tipo de Dados”.

Para descrições de funções que operam em valores temporais, veja a Seção 12.7, “Funções de Data e Hora”.

Mantenha estas considerações gerais em mente ao trabalhar com tipos de data e hora:

* O MySQL recupera valores para um determinado tipo de data ou hora em um formato de saída padrão, mas tenta interpretar uma variedade de formatos para os valores de entrada que você fornece (por exemplo, quando você especifica um valor a ser atribuído ou comparado a um tipo de data ou hora). Para uma descrição dos formatos permitidos para tipos de data e hora, veja a Seção 9.1.3, “Literais de Data e Hora”. É esperado que você forneça valores válidos. Resultados imprevisíveis podem ocorrer se você usar valores em outros formatos.

* Embora o MySQL tente interpretar valores em vários formatos, as partes da data devem ser sempre fornecidas na ordem ano-mês-dia (por exemplo, `'98-09-04'`), em vez das ordens mês-dia-ano ou dia-mês-ano comumente usadas em outros lugares (por exemplo, `'09-04-98'`, `'04-09-98'`). Para converter *strings* em outras ordens para a ordem ano-mês-dia, a função `STR_TO_DATE()` pode ser útil.

* Datas contendo valores de ano com 2 dígitos são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano com 2 dígitos usando estas regras:

  + Valores de ano no intervalo `70-99` se tornam `1970-1999`.

  + Valores de ano no intervalo `00-69` se tornam `2000-2069`.

  Veja também a Seção 11.2.10, “Anos com 2 Dígitos em Datas”.

* A conversão de valores de um tipo temporal para outro ocorre de acordo com as regras na Seção 11.2.9, “Conversão Entre Tipos de Data e Hora”.

* O MySQL converte automaticamente um valor de data ou hora para um número se o valor for usado em contexto numérico e vice-versa.

* Por padrão, quando o MySQL encontra um valor para um tipo de data ou hora que está fora do intervalo ou é inválido para o tipo, ele converte o valor para o valor “zero” daquele tipo. A exceção é que valores `TIME` fora do intervalo são truncados para o *endpoint* apropriado do intervalo `TIME`.

* Ao definir o modo SQL para o valor apropriado, você pode especificar mais exatamente que tipo de datas você deseja que o MySQL suporte. (Veja a Seção 5.1.10, “Modos SQL do Servidor”). Você pode fazer com que o MySQL aceite certas datas, como `'2009-11-31'`, habilitando o modo SQL `ALLOW_INVALID_DATES`. Isso é útil quando você deseja armazenar um valor “possivelmente incorreto” especificado pelo usuário (por exemplo, em um formulário *web*) no Database para processamento futuro. Sob este modo, o MySQL verifica apenas se o mês está no intervalo de 1 a 12 e se o dia está no intervalo de 1 a 31.

* O MySQL permite que você armazene datas onde o dia, ou o mês e o dia, são zero em uma coluna `DATE` ou `DATETIME`. Isso é útil para aplicações que precisam armazenar datas de nascimento para as quais você pode não saber a data exata. Neste caso, você simplesmente armazena a data como `'2009-00-00'` ou `'2009-01-00'`. No entanto, com datas como essas, você não deve esperar obter resultados corretos para funções como `DATE_SUB()` ou `DATE_ADD()` que exigem datas completas. Para não permitir partes de mês ou dia zero em datas, habilite o modo `NO_ZERO_IN_DATE`.

* O MySQL permite que você armazene um valor “zero” de `'0000-00-00'` como uma “data fictícia” (*dummy date*). Em alguns casos, isso é mais conveniente do que usar valores `NULL` e utiliza menos espaço de dados e Index. Para não permitir `'0000-00-00'`, habilite o modo `NO_ZERO_DATE`.

* Valores de data ou hora “zero” usados através do Connector/ODBC são convertidos automaticamente para `NULL` porque o ODBC não pode lidar com tais valores.

A tabela a seguir mostra o formato do valor “zero” para cada tipo. Os valores “zero” são especiais, mas você pode armazená-los ou referenciá-los explicitamente usando os valores mostrados na tabela. Você também pode fazer isso usando os valores `'0'` ou `0`, que são mais fáceis de escrever. Para tipos temporais que incluem uma parte de data (`DATE`, `DATETIME` e `TIMESTAMP`), o uso desses valores pode produzir avisos ou erros. O comportamento preciso depende de quais, se houver, os modos SQL *strict* e `NO_ZERO_DATE` estão habilitados; veja a Seção 5.1.10, “Modos SQL do Servidor”.

<table summary="Formato do valor zero para tipos de dados temporais."><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Tipo de Dado</th> <th>Valor “Zero”</th> </tr></thead><tbody><tr> <td><code>DATE</code></td> <td><code>'0000-00-00'</code></td> </tr><tr> <td><code>TIME</code></td> <td><code>'00:00:00'</code></td> </tr><tr> <td><code>DATETIME</code></td> <td><code>'0000-00-00 00:00:00'</code></td> </tr><tr> <td><code>TIMESTAMP</code></td> <td><code>'0000-00-00 00:00:00'</code></td> </tr><tr> <td><code>YEAR</code></td> <td><code>0000</code></td> </tr> </tbody></table>
