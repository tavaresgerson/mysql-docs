## 13.2 Tipos de Dados de Data e Hora

13.2.1 Sintaxe dos Tipos de Dados de Data e Hora

13.2.2 Os Tipos DATE, DATETIME e TIMESTAMP

13.2.3 O Tipo TIME

13.2.4 O Tipo YEAR

13.2.5 Inicialização e Atualização Automáticas para TIMESTAMP e DATETIME

13.2.6 Segundos Fracionários em Valores de Hora

13.2.7 Qual Calendário é Usado pelo MySQL?

13.2.8 Conversão entre Tipos de Data e Hora

13.2.9 Anos de 2 Dígitos em Datas

Os tipos de dados de data e hora para representar valores temporais são `DATE`, `TIME`, `DATETIME`, `TIMESTAMP` e `YEAR`. Cada tipo temporal tem uma faixa de valores válidos, bem como um valor “zero” que pode ser usado quando você especifica um valor inválido que o MySQL não pode representar. Os tipos `TIMESTAMP` e `DATETIME` têm um comportamento de atualização automática especial, descrito na Seção 13.2.5, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

Para informações sobre os requisitos de armazenamento dos tipos de dados temporais, consulte a Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”.

Para descrições de funções que operam em valores temporais, consulte a Seção 14.7, “Funções de Data e Hora”.

Mantenha essas considerações gerais em mente ao trabalhar com tipos de data e hora:

* O MySQL recupera valores para um dado tipo de data ou hora em um formato de saída padrão, mas tenta interpretar uma variedade de formatos para valores de entrada que você fornece (por exemplo, quando você especifica um valor a ser atribuído ou comparado a um tipo de data ou hora). Para uma descrição dos formatos permitidos para tipos de data e hora, consulte a Seção 11.1.3, “Letras de Data e Hora”. Espera-se que você forneça valores válidos. Resultados imprevisíveis podem ocorrer se você usar valores em outros formatos.

* Embora o MySQL tente interpretar valores em vários formatos, as partes das datas devem ser sempre fornecidas na ordem ano-mês-dia (por exemplo, `'98-09-04'`), em vez da ordem mês-dia-ano ou dia-mês-ano comumente usada em outros lugares (por exemplo, `'09-04-98'`, `'04-09-98'`). Para converter strings em outras ordens para a ordem ano-mês-dia, a função `STR_TO_DATE()` pode ser útil.

* Datas que contêm valores de ano de 2 dígitos são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano de 2 dígitos usando estas regras:

  + Valores de ano na faixa `70-99` se tornam `1970-1999`.

  + Valores de ano na faixa `00-69` se tornam `2000-2069`.

  Veja também a Seção 13.2.9, “Anos de 2 dígitos em datas”.

* A conversão de valores de um tipo temporal para outro ocorre de acordo com as regras na Seção 13.2.8, “Conversão entre tipos de data e hora”.

* O MySQL converte automaticamente um valor de data ou hora para um número se o valor for usado em um contexto numérico e vice-versa.

* Por padrão, quando o MySQL encontra um valor para um tipo de data ou hora que está fora da faixa ou de outra forma inválido para o tipo, ele converte o valor para o valor “zero” para esse tipo. A exceção é que valores `TIME` fora da faixa são cortados para o ponto final apropriado da faixa `TIME`.

* Ao definir o modo SQL para o valor apropriado, você pode especificar com mais precisão que tipo de datas o MySQL deve suportar. (Veja a Seção 7.1.11, “Modos SQL do Servidor”.) Você pode fazer o MySQL aceitar certas datas, como `'2009-11-31'`, ao habilitar o modo SQL `ALLOW_INVALID_DATES`. Isso é útil quando você deseja armazenar um valor “possivelmente incorreto” que o usuário especificou (por exemplo, em um formulário da web) no banco de dados para processamento futuro. Nesse modo, o MySQL verifica apenas se o mês está no intervalo de 1 a 12 e se o dia está no intervalo de 1 a 31.

* O MySQL permite que você armazene datas onde o dia ou o mês e o dia são zero em uma coluna `DATE` ou `DATETIME`. Isso é útil para aplicações que precisam armazenar datas de nascimento para as quais você pode não saber a data exata. Neste caso, você simplesmente armazena a data como `'2009-00-00'` ou `'2009-01-00'`. No entanto, com datas como essas, você não deve esperar obter resultados corretos para funções como `DATE_SUB()` ou `DATE_ADD()` que requerem datas completas. Para não permitir partes de mês ou dia zero em datas, habilite o modo `NO_ZERO_IN_DATE`.

* O MySQL permite que você armazene um valor “zero” de `'0000-00-00'` como uma “data fictícia”. Em alguns casos, isso é mais conveniente do que usar valores `NULL`, e usa menos espaço de dados e índice. Para não permitir `'0000-00-00'`, habilite o modo `NO_ZERO_DATE`.

* Valores de data ou hora “zero” usados através do Connector/ODBC são convertidos automaticamente para `NULL` porque o ODBC não pode lidar com tais valores.

A tabela a seguir mostra o formato do valor "zero" para cada tipo. Os valores "zero" são especiais, mas você pode armazená-los ou referenciá-los explicitamente usando os valores mostrados na tabela. Você também pode fazer isso usando os valores `'0'` ou `0`, que são mais fáceis de escrever. Para tipos temporais que incluem uma parte de data (`DATE`, `DATETIME` e `TIMESTAMP`), o uso desses valores pode produzir avisos ou erros. O comportamento preciso depende de quais, se houver, os modos SQL estritos e `NO_ZERO_DATE` estão habilitados; veja a Seção 7.1.11, “Modos SQL do Servidor”.

<table summary="Formato do valor 'zero' para tipos de dados temporais."><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Tipo de Dados</th> <th><span class="quote">“<span class="quote">Zero</span>”</span> Value</th> </tr></thead><tbody><tr> <td><a class="link" href="datetime.html" title="13.2.2 Os Tipos DATE, DATETIME e TIMESTAMP"><code>DATE</code></a></td> <td><code>'0000-00-00'</code></td> </tr><tr> <td><a class="link" href="time.html" title="13.2.3 O Tipo TIME"><code>TIME</code></a></td> <td><code>'00:00:00'</code></td> </tr><tr> <td><a class="link" href="datetime.html" title="13.2.2 Os Tipos DATE, DATETIME e TIMESTAMP"><code>DATETIME</code></a></td> <td><code>'0000-00-00 00:00:00'</code></td> </tr><tr> <td><a class="link" href="datetime.html" title="13.2.2 Os Tipos DATE, DATETIME e TIMESTAMP"><code>TIMESTAMP</code></a></td> <td><code>'0000-00-00 00:00:00'</code></td> </tr><tr> <td><a class="link" href="year.html" title="13.2.4 O Tipo YEAR"><code>YEAR</code></a></td> <td><code>0000</code></td> </tr></tbody></table>