## 11.2 Tipos de dados de data e hora

11.2.1 Data e Hora Tipo de Dados Sintaxe

11.2.2 Tipos DATE, DATETIME e TIMESTAMP

11.2.3 O Tipo TIME

11.2.4 O tipo YEAR

11.2.5 ANO de 2 dígitos (2) Limitações e migração para ANO de 4 dígitos

11.2.6 Inicialização e atualização automáticas para TIMESTAMP e DATETIME

11.2.7 Segundos fracionários em valores de tempo

11.2.8 Qual calendário é usado pelo MySQL?

11.2.9 Conversão entre tipos de data e hora

11.2.10 Anos de 2 dígitos nas datas

Os tipos de dados de data e hora para representar valores temporais são `DATE`, `TIME`, `DATETIME`, `TIMESTAMP` e `YEAR`. Cada tipo temporal tem um intervalo de valores válidos, bem como um valor “zero” que pode ser usado quando você especifica um valor inválido que o MySQL não pode representar. Os tipos `TIMESTAMP` e `DATETIME` têm um comportamento de atualização automática especial, descrito na Seção 11.2.6, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

Para obter informações sobre os requisitos de armazenamento dos tipos de dados temporais, consulte a Seção 11.7, “Requisitos de Armazenamento de Tipos de Dados”.

Para descrições de funções que operam com valores temporais, consulte a Seção 12.7, “Funções de Data e Hora”.

Tenha em mente essas considerações gerais ao trabalhar com tipos de data e hora:

- O MySQL recupera valores para uma data ou hora específica em um formato de saída padrão, mas tenta interpretar uma variedade de formatos para os valores de entrada que você fornece (por exemplo, quando você especifica um valor a ser atribuído ou comparado a uma data ou hora). Para uma descrição dos formatos permitidos para tipos de data e hora, consulte a Seção 9.1.3, “Letrais de Data e Hora”. Espera-se que você forneça valores válidos. Resultados imprevisíveis podem ocorrer se você usar valores em outros formatos.

- Embora o MySQL tente interpretar valores em vários formatos, as partes da data devem sempre ser fornecidas na ordem ano-mês-dia (por exemplo, `'98-09-04'`), em vez da ordem mês-dia-ano ou dia-mês-ano comumente usada em outros lugares (por exemplo, `'09-04-98'`, `'04-09-98'`). Para converter strings em outras ordens para a ordem ano-mês-dia, a função `STR_TO_DATE()` pode ser útil.

- As datas que contêm valores de ano de 2 dígitos são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano de 2 dígitos usando essas regras:

  - Os valores do ano na faixa `70-99` se tornam `1970-1999`.

  - Os valores do ano na faixa `00-69` se tornam `2000-2069`.

  Veja também a Seção 11.2.10, “Anos de 2 dígitos em datas”.

- A conversão de valores de um tipo temporal para outro ocorre de acordo com as regras da Seção 11.2.9, “Conversão entre tipos de data e hora”.

- O MySQL converte automaticamente um valor de data ou hora em um número se o valor for usado em um contexto numérico e vice-versa.

- Por padrão, quando o MySQL encontra um valor para um tipo de data ou hora que está fora do intervalo ou é inválido para o tipo, ele converte o valor para o valor “zero” para esse tipo. A exceção é que os valores `TIME` fora do intervalo são recortados para o ponto final apropriado do intervalo `TIME`.

- Ao definir o modo SQL para o valor apropriado, você pode especificar com mais precisão que tipo de datas você deseja que o MySQL suporte. (Veja a Seção 5.1.10, “Modos SQL do Servidor”.) Você pode fazer o MySQL aceitar certas datas, como `'2009-11-31'`, ao habilitar o modo SQL `ALLOW_INVALID_DATES`. Isso é útil quando você deseja armazenar um valor “possivelmente incorreto” que o usuário especificou (por exemplo, em um formulário da web) no banco de dados para processamento futuro. Nesse modo, o MySQL verifica apenas que o mês esteja no intervalo de 1 a 12 e que o dia esteja no intervalo de 1 a 31.

- O MySQL permite que você armazene datas em que o dia ou o mês e o dia são zero em uma coluna `DATE` ou `DATETIME`. Isso é útil para aplicações que precisam armazenar datas de nascimento para as quais você pode não saber a data exata. Neste caso, você simplesmente armazena a data como `'2009-00-00'` ou `'2009-01-00'`. No entanto, com datas como essas, você não deve esperar obter resultados corretos para funções como `DATE_SUB()` ou `DATE_ADD()` que exigem datas completas. Para impedir que partes do mês ou do dia sejam zero em datas, habilite o modo `NO_ZERO_IN_DATE`.

- O MySQL permite que você armazene um valor "zero" de `'0000-00-00'` como uma "data fictícia". Em alguns casos, isso é mais conveniente do que usar valores `NULL` e utiliza menos espaço de dados e de índice. Para desabilitar `'0000-00-00'`, habilite o modo `NO_ZERO_DATE`.

- Os valores de data ou hora “zero” usados através do Connector/ODBC são convertidos automaticamente em `NULL` porque o ODBC não consegue lidar com esses valores.

A tabela a seguir mostra o formato do valor "zero" para cada tipo. Os valores "zero" são especiais, mas você pode armazená-los ou referenciá-los explicitamente usando os valores mostrados na tabela. Você também pode fazer isso usando os valores `'0'` ou `0`, que são mais fáceis de escrever. Para tipos temporais que incluem uma parte de data (`DATE`, `DATETIME` e `TIMESTAMP`), o uso desses valores pode gerar avisos ou erros. O comportamento preciso depende de quais, se houver, os modos SQL estritos e `NO_ZERO_DATE` estão habilitados; consulte a Seção 5.1.10, “Modos SQL do Servidor”.

<table summary="Formato do valor zero para tipos de dados temporais."><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Tipo de dados</th> <th><span class="quote">“<span class="quote">Zero</span>”</span>Valor</th> </tr></thead><tbody><tr> <td><a class="link" href="datetime.html" title="11.2.2 Tipos DATE, DATETIME e TIMESTAMP">[[<code>DATE</code>]]</a></td> <td>[[<code>'0000-00-00'</code>]]</td> </tr><tr> <td><a class="link" href="time.html" title="11.2.3 O Tipo TIME">[[<code>TIME</code>]]</a></td> <td>[[<code>'00:00:00'</code>]]</td> </tr><tr> <td><a class="link" href="datetime.html" title="11.2.2 Tipos DATE, DATETIME e TIMESTAMP">[[<code>DATETIME</code>]]</a></td> <td>[[<code>'0000-00-00 00:00:00'</code>]]</td> </tr><tr> <td><a class="link" href="datetime.html" title="11.2.2 Tipos DATE, DATETIME e TIMESTAMP">[[<code>TIMESTAMP</code>]]</a></td> <td>[[<code>'0000-00-00 00:00:00'</code>]]</td> </tr><tr> <td><a class="link" href="year.html" title="11.2.4 O Tipo ANO">[[<code>YEAR</code>]]</a></td> <td>[[<code>0000</code>]]</td> </tr></tbody></table>
