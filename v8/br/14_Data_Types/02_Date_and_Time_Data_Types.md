## 13.2 Tipos de dados de data e hora

Os tipos de dados de data e hora para representar valores temporais são `DATE`, `TIME`, `DATETIME`, `TIMESTAMP` e `YEAR`. Cada tipo temporal tem uma faixa de valores válidos, bem como um valor “zero” que pode ser usado quando você especifica um valor inválido que o MySQL não pode representar. Os tipos `TIMESTAMP` e `DATETIME` têm um comportamento de atualização automática especial, descrito na Seção 13.2.5, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

Para informações sobre os requisitos de armazenamento dos tipos de dados temporais, consulte a Seção 13.7, “Requisitos de Armazenamento do Tipo de Dados”.

Para descrições de funções que operam em valores temporais, consulte a Seção 14.7, “Funções de data e hora”.

Tenha em mente essas considerações gerais ao trabalhar com tipos de data e hora:

* O MySQL recupera valores para um determinado tipo de data ou hora em um formato de saída padrão, mas tenta interpretar uma variedade de formatos para os valores de entrada que você fornece (por exemplo, quando você especifica um valor a ser atribuído ou comparado a um tipo de data ou hora). Para uma descrição dos formatos permitidos para tipos de data e hora, consulte a Seção 11.1.3, “Literais de data e hora”. Espera-se que você forneça valores válidos. Resultados imprevisíveis podem ocorrer se você usar valores em outros formatos.

* Embora o MySQL tente interpretar valores em vários formatos, as partes da data devem sempre ser fornecidas na ordem ano-mês-dia (por exemplo, `'98-09-04'`), em vez da ordem mês-dia-ano ou dia-mês-ano comumente usada em outros lugares (por exemplo, `'09-04-98'`, `'04-09-98'`). Para converter strings em outras ordens para a ordem ano-mês-dia, a função `STR_TO_DATE()` pode ser útil.

* As datas que contêm valores de ano de 2 dígitos são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano de 2 dígitos usando essas regras:

+ Os valores do ano na faixa `70-99` se tornam `1970-1999`.

+ Os valores do ano na faixa `00-69` se tornam `2000-2069`.

Veja também a Seção 13.2.9, “Anos de 2 dígitos em datas”.

* A conversão de valores de um tipo temporal para outro ocorre de acordo com as regras da Seção 13.2.8, “Conversão entre tipos de data e hora”.

* O MySQL converte automaticamente um valor de data ou hora em um número se o valor for usado em um contexto numérico e vice-versa.

* Por padrão, quando o MySQL encontra um valor para um tipo de data ou hora que está fora do intervalo ou de outra forma inválido para o tipo, ele converte o valor para o valor “zero” para esse tipo. A exceção é que os valores fora do intervalo `TIME` são cortados para o ponto final apropriado da faixa `TIME`.

* Ao definir o modo SQL para o valor apropriado, você pode especificar mais precisamente que tipo de datas você deseja que o MySQL suporte. (Veja a Seção 7.1.11, “Modos SQL do Servidor”.) Você pode fazer o MySQL aceitar certas datas, como `'2009-11-31'`, ao habilitar o modo SQL `ALLOW_INVALID_DATES`. Isso é útil quando você deseja armazenar um valor “possivelmente incorreto” que o usuário especificou (por exemplo, em um formulário da web) no banco de dados para processamento futuro. Nesse modo, o MySQL verifica apenas que o mês esteja no intervalo de 1 a 12 e que o dia esteja no intervalo de 1 a 31.

* O MySQL permite que você armazene datas onde o dia ou o mês e o dia são zero em uma coluna `DATE` ou `DATETIME`. Isso é útil para aplicações que precisam armazenar datas de nascimento para as quais você pode não conhecer a data exata. Neste caso, você simplesmente armazena a data como `'2009-00-00'` ou `'2009-01-00'`. No entanto, com datas como essas, você não deve esperar obter resultados corretos para funções como `DATE_SUB()` ou `DATE_ADD()` que requerem datas completas. Para não permitir partes de mês ou dia zero em datas, habilite o modo `NO_ZERO_IN_DATE`.

* O MySQL permite que você armazene um valor de "zero" de `'0000-00-00'` como uma "data fictícia". Em alguns casos, isso é mais conveniente do que usar os valores de `NULL`, e utiliza menos dados e espaço de índice. Para não permitir `'0000-00-00'`, habilite o modo `NO_ZERO_DATE`.

* Os valores de data ou hora "zero" usados através do Connector/ODBC são convertidos automaticamente para `NULL` porque o ODBC não pode lidar com esses valores.

A tabela a seguir mostra o formato do valor “zero” para cada tipo. Os valores “zero” são especiais, mas você pode armazená-los ou referenciá-los explicitamente usando os valores mostrados na tabela. Você também pode fazer isso usando os valores `'0'` ou `0`, que são mais fáceis de escrever. Para tipos temporais que incluem uma parte de data (`DATE`, `DATETIME` e `TIMESTAMP`), o uso desses valores pode produzir avisos ou erros. O comportamento preciso depende de qual, se houver, dos modos SQL estritos e `NO_ZERO_DATE` está habilitado; veja Seção 7.1.11, “Modos SQL do servidor”.

<table summary="Format of the zero value for temporal data types."><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Data Type</th> <th>“Zero” Value</th> </tr></thead><tbody><tr> <td><code>DATE</code></td> <td><code>'0000-00-00'</code></td> </tr><tr> <td><code>TIME</code></td> <td><code>'00:00:00'</code></td> </tr><tr> <td><code>DATETIME</code></td> <td><code>'0000-00-00 00:00:00'</code></td> </tr><tr> <td><code>TIMESTAMP</code></td> <td><code>'0000-00-00 00:00:00'</code></td> </tr><tr> <td><code>YEAR</code></td> <td><code>0000</code></td> </tr></tbody></table>

### 13.2.1 Sintaxe do tipo de dados de data e hora

Os tipos de dados de data e hora para representar valores temporais são `DATE`, `TIME`, `DATETIME`, `TIMESTAMP` e `YEAR`.

Para as descrições da faixa `DATE` e `DATETIME`, “apoiada” significa que, embora valores anteriores possam funcionar, não há garantia.

O MySQL permite frações de segundo para os valores de `TIME`, `DATETIME` e `TIMESTAMP`, com precisão de até microsegundos (6 dígitos). Para definir uma coluna que inclua uma parte de frações de segundo, use a sintaxe `type_name(fsp)`, onde *`type_name`* é `TIME`, `DATETIME` ou `TIMESTAMP`, e *`fsp`* é a precisão de frações de segundo. Por exemplo:

```
CREATE TABLE t1 (t TIME(3), dt DATETIME(6), ts TIMESTAMP(0));
```

O valor *`fsp`*, se fornecido, deve estar na faixa de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão padrão padrão SQL de 6, para compatibilidade com versões anteriores do MySQL.)

Qualquer coluna `TIMESTAMP` ou `DATETIME` em uma tabela pode ter propriedades de inicialização e atualização automática; veja a Seção 13.2.5, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

* `DATE`

Uma data. A faixa de valores compatível é `'1000-01-01'` a `'9999-12-31'`. O MySQL exibe os valores de `DATE` no formato `'YYYY-MM-DD'`, mas permite a atribuição de valores às colunas de `DATE` usando strings ou números.

* `DATETIME[(fsp)]`

Uma combinação de data e hora. O intervalo suportado é `'1000-01-01 00:00:00.000000'` a `'9999-12-31 23:59:59.499999'`. O MySQL exibe os valores de `DATETIME` no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'`, mas permite a atribuição de valores às colunas de `DATETIME` usando strings ou números.

Um valor opcional *`fsp`* na faixa de 0 a 6 pode ser dado para especificar a precisão de segundos fracionários. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0.

A inicialização automática e a atualização para a data e hora atuais para as colunas `DATETIME` podem ser especificadas usando as cláusulas de definição de colunas `DEFAULT` e `ON UPDATE`, conforme descrito na Seção 13.2.5, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

* `TIMESTAMP[(fsp)]`

Um marcador de tempo. A faixa é de `'1970-01-01 00:00:01.000000'` UTC a `'2038-01-19 03:14:07.499999'` UTC. Os valores de `TIMESTAMP` são armazenados como o número de segundos desde a época (`'1970-01-01 00:00:00'` UTC). Um `TIMESTAMP` não pode representar o valor `'1970-01-01 00:00:00'`, porque esse é equivalente a 0 segundos desde a época e o valor 0 é reservado para representar `'0000-00-00 00:00:00'`, o valor `TIMESTAMP` “zero”.

Um valor opcional *`fsp`* na faixa de 0 a 6 pode ser dado para especificar a precisão de segundos fracionários. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0.

A forma como o servidor lida com as definições do `TIMESTAMP` depende do valor da variável de sistema `explicit_defaults_for_timestamp` (consulte a Seção 7.1.8, “Variáveis do sistema do servidor”).

Se `explicit_defaults_for_timestamp` estiver habilitado, não há atribuição automática dos atributos `DEFAULT CURRENT_TIMESTAMP` ou `ON UPDATE CURRENT_TIMESTAMP` a qualquer coluna `TIMESTAMP`. Eles devem ser incluídos explicitamente na definição da coluna. Além disso, qualquer `TIMESTAMP` não explicitamente declarado como `NOT NULL` permite valores de `NULL`.

Se `explicit_defaults_for_timestamp` estiver desativado, o servidor trata `TIMESTAMP` da seguinte forma:

A menos que especificado de outra forma, a primeira coluna `TIMESTAMP` em uma tabela é definida para ser automaticamente definida com a data e hora da modificação mais recente, se não for explicitamente atribuído um valor. Isso torna `TIMESTAMP` útil para registrar o timestamp de uma operação de `INSERT` ou `UPDATE`. Você também pode definir qualquer coluna `TIMESTAMP` para a data e hora atuais, atribuindo-lhe um valor `NULL`, a menos que tenha sido definido com o atributo `NULL` para permitir valores `NULL`.

A inicialização automática e a atualização para a data e hora atuais podem ser especificadas usando as cláusulas de definição de coluna `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`. Por padrão, a primeira coluna `TIMESTAMP` tem essas propriedades, como mencionado anteriormente. No entanto, qualquer coluna `TIMESTAMP` em uma tabela pode ser definida para ter essas propriedades.

* `TIME[(fsp)]`

Um intervalo. A faixa é `'-838:59:59.000000'` a `'838:59:59.000000'`. O MySQL exibe os valores de `TIME` no formato `'hh:mm:ss[.fraction]'`, mas permite a atribuição de valores às colunas de `TIME` usando strings ou números.

Um valor opcional *`fsp`* na faixa de 0 a 6 pode ser dado para especificar a precisão de segundos fracionários. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0.

* `YEAR[(4)]`

Um ano no formato de 4 dígitos. O MySQL exibe os valores de `YEAR` no formato *`YYYY`*, mas permite a atribuição de valores às colunas `YEAR` usando strings ou números. Os valores são exibidos como `1901` a `2155`, ou `0000`.

Para informações adicionais sobre o formato de exibição de `YEAR` e a interpretação dos valores de entrada, consulte a Seção 13.2.4, “O tipo YEAR”.

Nota

A partir do MySQL 8.0.19, o tipo de dados `YEAR(4)` com largura de exibição explícita é descontinuado; você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Em vez disso, use `YEAR` sem largura de exibição, que tem o mesmo significado.

O MySQL 8.0 não suporta o tipo de dados de 2 dígitos `YEAR(2)` permitido em versões mais antigas do MySQL. Para instruções sobre a conversão para o tipo de dados de 4 dígitos `YEAR`, consulte Limitações de ANO(2) de 2 dígitos e Migração para ANO de 4 dígitos, no Manual de Referência do MySQL 5.7.

As funções agregadoras `SUM()` e `AVG()` não funcionam com valores temporais. (Elas convertem os valores em números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, realize a operação agregadora e converta de volta a um valor temporal. Exemplos:

```
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

### 13.2.2 Os tipos DATE, DATETIME e TIMESTAMP

Os tipos `DATE`, `DATETIME` e `TIMESTAMP` estão relacionados. Esta seção descreve suas características, como eles são semelhantes e como eles diferem. O MySQL reconhece os valores `DATE`, `DATETIME` e `TIMESTAMP` em vários formatos, descritos na Seção 11.1.3, “Literais de Data e Hora”. Para as descrições das faixas `DATE` e `DATETIME`, “suportada” significa que, embora valores anteriores possam funcionar, não há garantia.

O tipo `DATE` é usado para valores com uma parte de data, mas sem parte de hora. O MySQL recupera e exibe os valores `DATE` no formato `'YYYY-MM-DD'`. A faixa de valores suportada é `'1000-01-01'` a `'9999-12-31'`.

O tipo `DATETIME` é usado para valores que contêm partes de data e hora. O MySQL recupera e exibe os valores `DATETIME` no formato `'YYYY-MM-DD hh:mm:ss'`. A faixa de valores suportada é `'1000-01-01 00:00:00'` a `'9999-12-31 23:59:59'`.

O tipo de dados `TIMESTAMP` é usado para valores que contêm partes de data e hora. `TIMESTAMP` tem uma faixa de `'1970-01-01 00:00:01'` UTC a `'2038-01-19 03:14:07'` UTC.

Um valor `DATETIME` ou `TIMESTAMP` pode incluir uma parte fracionária de segundos em até microsegundos (6 dígitos) de precisão. Em particular, qualquer parte fracionária em um valor inserido em uma coluna `DATETIME` ou `TIMESTAMP` é armazenada em vez de ser descartada. Com a parte fracionária incluída, o formato para esses valores é `'YYYY-MM-DD hh:mm:ss[.fraction]'`, a faixa para os valores de `DATETIME` é `'1000-01-01 00:00:00.000000'` a `'9999-12-31 23:59:59.499999'`, e a faixa para os valores de `TIMESTAMP` é `'1970-01-01 00:00:01.000000'` a `'2038-01-19 03:14:07.499999'`. A parte fracionária deve sempre ser separada do resto do tempo por um ponto decimal; nenhum outro delimitador de segundos fracionários é reconhecido. Para informações sobre suporte a segundos fracionários no MySQL, consulte a Seção 13.2.6, “Segundos Fracionários em Valores de Tempo”.

Os tipos de dados `TIMESTAMP` e `DATETIME` oferecem inicialização e atualização automática para a data e hora atuais. Para mais informações, consulte a Seção 13.2.5, “Inicialização e atualização automática para TIMESTAMP e DATETIME”.

O MySQL converte os valores `TIMESTAMP` do fuso horário atual para UTC para armazenamento e, em seguida, de volta do UTC para o fuso horário atual para recuperação. (Isso não ocorre para outros tipos, como `DATETIME`.). Por padrão, o fuso horário atual para cada conexão é o horário do servidor. O fuso horário pode ser definido por conexão. Enquanto a configuração do fuso horário permanecer constante, você obterá o mesmo valor que armazenou. Se você armazenar um valor `TIMESTAMP`, e depois alterar o fuso horário e recuperar o valor, o valor recuperado é diferente do valor que você armazenou. Isso ocorre porque o mesmo fuso horário não foi usado para conversão em ambas as direções. O fuso horário atual está disponível como o valor da variável de sistema `time_zone`. Para mais informações, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

Em MySQL 8.0.19 e versões posteriores, você pode especificar um deslocamento de fuso horário ao inserir um valor `TIMESTAMP` ou `DATETIME` em uma tabela. Consulte a Seção 11.1.3, “Literais de data e hora”, para obter mais informações e exemplos.

Os valores inválidos de `DATE`, `DATETIME` ou `TIMESTAMP` são convertidos para o valor “zero” do tipo apropriado (`'0000-00-00'` ou `'0000-00-00 00:00:00'`, se o modo SQL permitir essa conversão. O comportamento preciso depende de qual, se houver, dos modos de SQL estrito e do modo SQL `NO_ZERO_DATE` estão habilitados; veja Seção 7.1.11, “Modos de SQL do servidor”.

Em MySQL 8.0.22 e versões posteriores, você pode converter os valores `TIMESTAMP` para valores UTC `DATETIME` ao recuperá-los usando `CAST()` com o operador `AT TIME ZONE`, conforme mostrado aqui:

```
mysql> SELECT col,
     >     CAST(col AT TIME ZONE INTERVAL '+00:00' AS DATETIME) AS ut
     >     FROM ts ORDER BY id;
+---------------------+---------------------+
| col                 | ut                  |
+---------------------+---------------------+
| 2020-01-01 10:10:10 | 2020-01-01 15:10:10 |
| 2019-12-31 23:40:10 | 2020-01-01 04:40:10 |
| 2020-01-01 13:10:10 | 2020-01-01 18:10:10 |
| 2020-01-01 10:10:10 | 2020-01-01 15:10:10 |
| 2020-01-01 04:40:10 | 2020-01-01 09:40:10 |
| 2020-01-01 18:10:10 | 2020-01-01 23:10:10 |
+---------------------+---------------------+
```

Para informações completas sobre sintaxe e exemplos adicionais, consulte a descrição da função `CAST()`.

Esteja ciente de certas propriedades da interpretação do valor de data no MySQL:

* O MySQL permite um formato "relaxado" para valores especificados como strings, no qual qualquer caractere de pontuação pode ser usado como delimitador entre partes de data ou partes de hora. Em alguns casos, essa sintaxe pode ser enganosa. Por exemplo, um valor como `'10:11:12'` pode parecer um valor de hora devido ao `:`, mas é interpretado como o ano `'2010-11-12'` se usado em contexto de data. O valor `'10:45:15'` é convertido para `'0000-00-00'` porque `'45'` não é um mês válido.

O único delimitador reconhecido entre uma parte de data e hora e uma parte de segundos fracionários é o ponto decimal.

* O servidor exige que os valores de mês e dia sejam válidos e não apenas dentro do intervalo de 1 a 12 e 1 a 31, respectivamente. Com o modo rigoroso desativado, datas inválidas, como `'2004-04-31'`, são convertidas para `'0000-00-00'` e um aviso é gerado. Com o modo rigoroso ativado, datas inválidas geram um erro. Para permitir tais datas, ative `ALLOW_INVALID_DATES`. Consulte a Seção 7.1.11, “Modos SQL do servidor”, para obter mais informações.

* O MySQL não aceita valores `TIMESTAMP` que incluem um zero na coluna de dia ou mês ou valores que não são uma data válida. A única exceção a essa regra é o valor especial “zero” `'0000-00-00 00:00:00'`, se o modo SQL permitir esse valor. O comportamento preciso depende de qual (se houver) dos modos SQL estrito e do modo SQL `NO_ZERO_DATE` está habilitado; veja Seção 7.1.11, “Modos SQL do servidor”.

* As datas que contêm valores de ano de 2 dígitos são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano de 2 dígitos usando essas regras:

+ Os valores do ano na faixa `00-69` se tornam `2000-2069`.

+ Os valores do ano na faixa `70-99` se tornam `1970-1999`.

Veja também a Seção 13.2.9, “Anos de 2 dígitos em datas”.

### 13.2.3 O Tipo TIME

O MySQL recupera e exibe os valores de `TIME` no formato *`'hh:mm:ss'`* (ou *`'hhh:mm:ss'`* para valores de grandes horas). Os valores de `TIME` podem variar de `'-838:59:59'` a `'838:59:59'`. A parte das horas pode ser tão grande porque o tipo `TIME` pode ser usado não apenas para representar uma hora do dia (que deve ser menor que 24 horas), mas também para representar tempo decorrido ou um intervalo de tempo entre dois eventos (que pode ser muito maior que 24 horas, ou até mesmo negativo).

O MySQL reconhece os valores `TIME` em vários formatos, alguns dos quais podem incluir uma parte fracionária de segundos em até microsegundos (6 dígitos) de precisão. Consulte a Seção 11.1.3, “Literais de Data e Hora”. Para informações sobre o suporte a partes fracionárias no MySQL, consulte a Seção 13.2.6, “Segundos Fracionários em Valores de Hora”. Em particular, qualquer parte fracionária em um valor inserido em uma coluna `TIME` é armazenada em vez de ser descartada. Com a parte fracionária incluída, a faixa para os valores `TIME` é de `'-838:59:59.000000'` a `'838:59:59.000000'`.

Tenha cuidado ao atribuir valores abreviados a uma coluna `TIME`. O MySQL interpreta valores abreviados `TIME` com colchetes como hora do dia. Isso significa que `'11:12'` significa `'11:12:00'`, não `'00:11:12'`. O MySQL interpreta valores abreviados sem colchetes, assumindo que os dois dígitos mais à direita representam segundos (ou seja, como tempo decorrido em vez de como hora do dia). Por exemplo, você pode pensar que `'1112'` e `1112` significam `'11:12:00'` (12 minutos após as 11 horas), mas o MySQL os interpreta como `'00:11:12'` (11 minutos e 12 segundos). Da mesma forma, `'12'` e `12` são interpretados como `'00:00:12'`.

O único delimitador reconhecido entre uma parte de tempo e uma parte de segundos fracionários é o ponto decimal.

Por padrão, os valores que estão fora do intervalo `TIME`, mas que são válidos de outra forma, são recortados para o ponto final mais próximo do intervalo. Por exemplo, `'-850:00:00'` e `'850:00:00'` são convertidos em `'-838:59:59'` e `'838:59:59'`. Os valores inválidos de `TIME` são convertidos em `'00:00:00'`. Observe que, como `'00:00:00'` é ele mesmo um valor válido de `TIME`, não é possível determinar, a partir de um valor de `'00:00:00'` armazenado em uma tabela, se o valor original foi especificado como `'00:00:00'` ou se foi inválido.

Para um tratamento mais restritivo de valores inválidos de `TIME`, habilite o modo SQL rigoroso para que ocorram erros. Veja a Seção 7.1.11, “Modos SQL do servidor”.

### 13.2.4 O Tipo ANO

O tipo `YEAR` é um tipo de 1 byte usado para representar valores de ano. Ele pode ser declarado como `YEAR` com uma largura de exibição implícita de 4 caracteres, ou, de forma equivalente, como `YEAR(4)` com uma largura de exibição explícita.

Nota

A partir do MySQL 8.0.19, o tipo de dados `YEAR(4)` com largura de exibição explícita é descontinuado e você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Em vez disso, use `YEAR` sem largura de exibição, que tem o mesmo significado.

O MySQL 8.0 não suporta o tipo de dados de 2 dígitos `YEAR(2)` permitido em versões mais antigas do MySQL. Para obter instruções sobre a conversão para o tipo de dados de 4 dígitos `YEAR`, consulte Limitações de ANO(2) de 2 dígitos e Migração para ANO de 4 dígitos, no Manual de Referência do MySQL 5.7.

O MySQL exibe os valores de `YEAR` no formato *`YYYY`*, com uma faixa de `1901` a `2155` e `0000`.

`YEAR` aceita valores de entrada em uma variedade de formatos:

* Como cadeias de 4 dígitos na faixa `'1901'` a `'2155'`.

* Como números de 4 dígitos na faixa `1901` a `2155`.

* Como cadeias de 1 ou 2 dígitos no intervalo `'0'` a `'99'`. O MySQL converte valores nos intervalos `'0'` a `'69'` e `'70'` a `'99'` a `YEAR` nos intervalos `2000` a `2069` e `1970` a `1999`.

* Como números de 1 ou 2 dígitos na faixa `0` a `99`. O MySQL converte valores nas faixas `1` a `69` e `70` a `99` a `YEAR` nas faixas `2001` a `2069` e `1970` a `1999`.

O resultado da inserção de um número `0` tem um valor de exibição de `0000` e um valor interno de `0000`. Para inserir zero e interpretá-lo como `2000`, especifique-o como uma string `'0'` ou `'00'`.

* Como resultado de funções que retornam um valor aceitável no contexto do `YEAR`, como o `NOW()`.

Se o modo SQL rigoroso não estiver habilitado, o MySQL converte os valores inválidos de `YEAR` em `0000`. No modo SQL rigoroso, tentar inserir um valor inválido de `YEAR` produz um erro.

Veja também a Seção 13.2.9, “Anos de 2 dígitos em datas”.

### 13.2.5 Inicialização e atualização automática para TIMESTAMP e DATETIME

As colunas `TIMESTAMP` e `DATETIME` podem ser automaticamente inicializadas e atualizadas para a data e hora atuais (ou seja, o timestamp atual).

Para qualquer coluna `TIMESTAMP` ou `DATETIME` em uma tabela, você pode atribuir o timestamp atual como o valor padrão, o valor de auto-atualização ou ambos:

* Uma coluna auto-inicializada é definida pelo timestamp atual para as linhas inseridas que não especificam nenhum valor para a coluna.

* Uma coluna auto-atualizada é automaticamente atualizada para o timestamp atual quando o valor de qualquer outra coluna na linha é alterado do seu valor atual. Uma coluna auto-atualizada permanece inalterada se todas as outras colunas forem definidas com seus valores atuais. Para evitar que uma coluna auto-atualizada seja atualizada quando outras colunas são alteradas, defina-a explicitamente com seu valor atual. Para atualizar uma coluna auto-atualizada mesmo quando outras colunas não são alteradas, defina-a explicitamente com o valor que ela deve ter (por exemplo, defina-a com `CURRENT_TIMESTAMP`).

Além disso, se a variável de sistema `explicit_defaults_for_timestamp` estiver desativada, você pode inicializar ou atualizar qualquer coluna `TIMESTAMP` (mas não `DATETIME`) para a data e hora atuais, atribuindo-a um valor de `NULL`, a menos que tenha sido definida com o atributo `NULL` para permitir valores de `NULL`.

Para especificar propriedades automáticas, use as cláusulas `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` nas definições de colunas. A ordem das cláusulas não importa. Se ambas estiverem presentes em uma definição de coluna, qualquer uma pode ocorrer primeiro. Qualquer um dos sinônimos para `CURRENT_TIMESTAMP` tem o mesmo significado que `CURRENT_TIMESTAMP`. Estes são `CURRENT_TIMESTAMP()`, `NOW()`, `LOCALTIME`, `LOCALTIME()`, `LOCALTIMESTAMP` e `LOCALTIMESTAMP()`.

O uso de `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` é específico para `TIMESTAMP` e `DATETIME`. A cláusula `DEFAULT` também pode ser usada para especificar um valor padrão (não automático) constante (por exemplo, `DEFAULT 0` ou `DEFAULT '2000-01-01 00:00:00'`).

Nota

Os exemplos a seguir utilizam `DEFAULT 0`, uma configuração padrão que pode gerar avisos ou erros, dependendo se o modo SQL rigoroso ou o modo SQL `NO_ZERO_DATE` está habilitado. Esteja ciente de que o modo SQL `TRADITIONAL` inclui o modo rigoroso e `NO_ZERO_DATE`. Veja a Seção 7.1.11, “Modos SQL do servidor”.

As definições de colunas `TIMESTAMP` ou `DATETIME` podem especificar o timestamp atual para os valores padrão e de auto-atualização, para uma delas, mas não para a outra, ou para nenhuma delas. Diferentes colunas podem ter diferentes combinações de propriedades automáticas. As seguintes regras descrevem as possibilidades:

* Com os `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`, a coluna tem o timestamp atual como seu valor padrão e é automaticamente atualizado para o timestamp atual.

  ```
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  ```

* Com uma cláusula `DEFAULT`, mas sem cláusula `ON UPDATE CURRENT_TIMESTAMP`, a coluna tem o valor padrão dado e não é automaticamente atualizada para o timestamp atual.

O padrão depende de se a cláusula `DEFAULT` especifica `CURRENT_TIMESTAMP` ou um valor constante. Com `CURRENT_TIMESTAMP`, o padrão é o timestamp atual.

  ```
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

Com uma constante, o valor padrão é o valor fornecido. Neste caso, a coluna não tem propriedades automáticas.

  ```
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT 0,
    dt DATETIME DEFAULT 0
  );
  ```

* Com uma cláusula `ON UPDATE CURRENT_TIMESTAMP` e uma cláusula constante `DEFAULT`, a coluna é automaticamente atualizada para o timestamp atual e tem o valor padrão constante dado.

  ```
  CREATE TABLE t1 (
    ts TIMESTAMP DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP,
    dt DATETIME DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP
  );
  ```

* Com uma cláusula `ON UPDATE CURRENT_TIMESTAMP`, mas sem cláusula `DEFAULT`, a coluna é automaticamente atualizada para o timestamp atual, mas não tem o timestamp atual para seu valor padrão.

O padrão neste caso é dependente do tipo. `TIMESTAMP` tem um padrão de 0, a menos que seja definido com o atributo `NULL`, caso em que o padrão é `NULL`.

  ```
  CREATE TABLE t1 (
    ts1 TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,     -- default 0
    ts2 TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP -- default NULL
  );
  ```

`DATETIME` tem um valor padrão de `NULL`, a menos que seja definido com o atributo `NOT NULL`, caso em que o valor padrão é 0.

  ```
  CREATE TABLE t1 (
    dt1 DATETIME ON UPDATE CURRENT_TIMESTAMP,         -- default NULL
    dt2 DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP -- default 0
  );
  ```

As colunas `TIMESTAMP` e `DATETIME` não possuem propriedades automáticas, a menos que sejam especificadas explicitamente, com esta exceção: Se a variável de sistema `explicit_defaults_for_timestamp` estiver desativada, a *primeira* coluna `TIMESTAMP` terá tanto `DEFAULT CURRENT_TIMESTAMP` quanto `ON UPDATE CURRENT_TIMESTAMP` se nenhuma delas for especificada explicitamente. Para suprimir as propriedades automáticas para a primeira coluna `TIMESTAMP`, use uma dessas estratégias:

* Ative a variável de sistema `explicit_defaults_for_timestamp`. Neste caso, as cláusulas `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP` que especificam inicialização e atualização automática estão disponíveis, mas não são atribuídas a nenhuma coluna `TIMESTAMP`, a menos que sejam explicitamente incluídas na definição da coluna.

* Alternativamente, se `explicit_defaults_for_timestamp` estiver desativado, faça um dos seguintes:

+ Defina a coluna com uma cláusula `DEFAULT` que especifica um valor padrão constante.

+ Especifique o atributo `NULL`. Isso também faz com que a coluna permita valores de `NULL`, o que significa que você não pode atribuir o timestamp atual ao definir a coluna para `NULL`. Atribuir `NULL` define a coluna para `NULL`, não o timestamp atual. Para atribuir o timestamp atual, defina a coluna para `CURRENT_TIMESTAMP` ou um sinônimo como `NOW()`.

Considere essas definições de tabela:

```
CREATE TABLE t1 (
  ts1 TIMESTAMP DEFAULT 0,
  ts2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE t2 (
  ts1 TIMESTAMP NULL,
  ts2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE t3 (
  ts1 TIMESTAMP NULL DEFAULT 0,
  ts2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP);
```

As tabelas têm essas propriedades:

* Em cada definição de tabela, a primeira coluna `TIMESTAMP` não tem inicialização ou atualização automática.

* As tabelas diferem na forma como a coluna `ts1` lida com os valores de `NULL`. Para `t1`, `ts1` é `NOT NULL` e atribuir-lhe um valor de `NULL` o configura para o timestamp atual. Para `t2` e `t3`, `ts1` permite `NULL` e atribuir-lhe um valor de `NULL` o configura para `NULL`.

* `t2` e `t3` diferem no valor padrão para `ts1`. Para `t2`, `ts1` é definido para permitir `NULL`, portanto, o padrão também é `NULL` na ausência de uma cláusula explícita de `DEFAULT`. Para `t3`, `ts1` permite `NULL`, mas tem um padrão explícito de 0.

Se uma definição de coluna `TIMESTAMP` ou `DATETIME` incluir explicitamente um valor de precisão de frações de segundo em qualquer lugar, o mesmo valor deve ser utilizado em toda a definição da coluna. Isso é permitido:

```
CREATE TABLE t1 (
  ts TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);
```

Isso não é permitido:

```
CREATE TABLE t1 (
  ts TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(3)
);
```

#### Inicialização do TIMESTAMP e o atributo NULL

Se a variável de sistema `explicit_defaults_for_timestamp` estiver desativada, as colunas `TIMESTAMP` por padrão são `NOT NULL`, não podem conter valores de `NULL`, e a atribuição de `NULL` atribui o timestamp atual. Para permitir que uma coluna `TIMESTAMP` contenha `NULL`, declare-a explicitamente com o atributo `NULL`. Neste caso, o valor padrão também se torna `NULL`, a menos que seja sobrescrito com uma cláusula `DEFAULT` que especifica um valor padrão diferente. `DEFAULT NULL` pode ser usado para especificar explicitamente `NULL` como o valor padrão. (Para uma coluna `TIMESTAMP` não declarada com o atributo `NULL`, `DEFAULT NULL` é inválida.) Se uma coluna `TIMESTAMP` permite valores de `NULL`, a atribuição de `NULL` define-os como `NULL`, não como o timestamp atual.

A tabela a seguir contém várias colunas `TIMESTAMP` que permitem valores `NULL`:

```
CREATE TABLE t
(
  ts1 TIMESTAMP NULL DEFAULT NULL,
  ts2 TIMESTAMP NULL DEFAULT 0,
  ts3 TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);
```

Uma coluna `TIMESTAMP` que permite valores de `NULL` *não* assume o timestamp atual no momento da inserção, exceto sob uma das seguintes condições:

* Seu valor padrão é definido como `CURRENT_TIMESTAMP` e não há valor especificado para a coluna

* `CURRENT_TIMESTAMP` ou qualquer um de seus sinônimos, como `NOW()`, é explicitamente inserido na coluna

Em outras palavras, uma coluna `TIMESTAMP` definida para permitir que os valores de `NULL` se autoinicializem apenas se sua definição incluir `DEFAULT CURRENT_TIMESTAMP`:

```
CREATE TABLE t (ts TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP);
```

Se a coluna `TIMESTAMP` permitir valores de `NULL`, mas sua definição não incluir `DEFAULT CURRENT_TIMESTAMP`, você deve inserir explicitamente um valor correspondente à data e hora atuais. Suponha que as tabelas `t1` e `t2` tenham essas definições:

```
CREATE TABLE t1 (ts TIMESTAMP NULL DEFAULT '0000-00-00 00:00:00');
CREATE TABLE t2 (ts TIMESTAMP NULL DEFAULT NULL);
```

Para definir a coluna `TIMESTAMP` em qualquer uma das tabelas para o timestamp atual no momento da inserção, atribua explicitamente esse valor. Por exemplo:

```
INSERT INTO t2 VALUES (CURRENT_TIMESTAMP);
INSERT INTO t1 VALUES (NOW());
```

Se a variável de sistema `explicit_defaults_for_timestamp` estiver habilitada, as colunas `TIMESTAMP` permitem valores de `NULL` apenas se declarados com o atributo `NULL`. Além disso, as colunas `TIMESTAMP` não permitem atribuir `NULL` para atribuir o timestamp atual, seja declarado com o atributo `NULL` ou `NOT NULL`. Para atribuir o timestamp atual, defina a coluna para `CURRENT_TIMESTAMP` ou um sinônimo, como `NOW()`.

### 13.2.6 Segundos fracionários em valores de tempo

O MySQL oferece suporte a segundos fracionários para os valores `TIME`, `DATETIME` e `TIMESTAMP`, com precisão de até microsegundos (6 dígitos):

* Para definir uma coluna que inclua uma parte de segundos fracionários, use a sintaxe `type_name(fsp)`, onde *`type_name`* é `TIME`, `DATETIME` ou `TIMESTAMP`, e *`fsp`* é a precisão dos segundos fracionários. Por exemplo:

  ```
  CREATE TABLE t1 (t TIME(3), dt DATETIME(6));
  ```

O valor *`fsp`*, se fornecido, deve estar na faixa de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão padrão padrão do SQL de 6, para compatibilidade com versões anteriores do MySQL.)

* Inserir um valor `TIME`, `DATE` ou `TIMESTAMP` com uma parte de segundos fracionários em uma coluna do mesmo tipo, mas com menos dígitos fracionários, resulta em arredondamento. Considere uma tabela criada e preenchida da seguinte forma:

  ```
  CREATE TABLE fractest( c1 TIME(2), c2 DATETIME(2), c3 TIMESTAMP(2) );
  INSERT INTO fractest VALUES
  ('17:51:04.777', '2018-09-08 17:51:04.777', '2018-09-08 17:51:04.777');
  ```

Os valores temporais são inseridos na tabela com arredondamento:

  ```
  mysql> SELECT * FROM fractest;
  +-------------+------------------------+------------------------+
  | c1          | c2                     | c3                     |
  +-------------+------------------------+------------------------+
  | 17:51:04.78 | 2018-09-08 17:51:04.78 | 2018-09-08 17:51:04.78 |
  +-------------+------------------------+------------------------+
  ```

Não há aviso ou erro quando tal arredondamento ocorre. Esse comportamento segue o padrão SQL.

Para inserir os valores com truncação, em vez disso, habilite o modo `TIME_TRUNCATE_FRACTIONAL` SQL:

  ```
  SET @@sql_mode = sys.list_add(@@sql_mode, 'TIME_TRUNCATE_FRACTIONAL');
  ```

Com esse modo SQL ativado, os valores temporais são inseridos com truncação:

  ```
  mysql> SELECT * FROM fractest;
  +-------------+------------------------+------------------------+
  | c1          | c2                     | c3                     |
  +-------------+------------------------+------------------------+
  | 17:51:04.77 | 2018-09-08 17:51:04.77 | 2018-09-08 17:51:04.77 |
  +-------------+------------------------+------------------------+
  ```

* Funções que aceitam argumentos temporais aceitam valores com segundos fracionários. Os valores de funções temporais incluem segundos fracionários conforme apropriado. Por exemplo, `NOW()` sem argumento retorna a data e a hora atuais sem parte fracionária, mas aceita um argumento opcional de 0 a 6 para especificar que o valor de retorno inclui uma parte de segundos fracionários de tantos dígitos.

* A sintaxe para literais temporais produz valores temporais: `DATE 'str'`, `TIME 'str'` e `TIMESTAMP 'str'`, e os equivalentes da sintaxe ODBC. O valor resultante inclui uma parte de segundos fracionários de final se especificada. Anteriormente, a palavra-chave do tipo de tipo temporal era ignorada e esses construtos produziam o valor de string. Veja SQL Padrão e Literais de Data e Hora ODBC

### 13.2.7 Qual calendário é usado pelo MySQL?

O MySQL utiliza o que é conhecido como calendário gregoriano proleptico.

Todo país que mudou do calendário Juliano para o Gregoriano teve que descartar pelo menos dez dias durante a mudança. Para entender como isso funciona, considere o mês de outubro de 1582, quando ocorreu a primeira mudança do Juliano para o Gregoriano.

<table summary="The month of October 1582, when the first Julian-to-Gregorian switch occurred. Table headings are days of the week and table rows list the dates for each day of the week. The table is intended to illustrate that there are no dates between October 4 and October 15."><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><thead><tr> <th scope="col">Monday</th> <th scope="col">Tuesday</th> <th scope="col">Wednesday</th> <th scope="col">Thursday</th> <th scope="col">Friday</th> <th scope="col">Saturday</th> <th scope="col">Sunday</th> </tr></thead><tbody><tr> <th scope="row">1</th> <td>2</td> <td>3</td> <td>4</td> <td>15</td> <td>16</td> <td>17</td> </tr><tr> <th scope="row">18</th> <td>19</td> <td>20</td> <td>21</td> <td>22</td> <td>23</td> <td>24</td> </tr><tr> <th scope="row">25</th> <td>26</td> <td>27</td> <td>28</td> <td>29</td> <td>30</td> <td>31</td> </tr></tbody></table>

Não há datas entre 4 de outubro e 15 de outubro. Essa descontinuidade é chamada de transição. Quaisquer datas anteriores à transição são gregorianas, e quaisquer datas que a sigam são julianas. As datas durante uma transição são inexistentes.

Um calendário aplicado a datas em que não estava realmente em uso é chamado proléptico. Assim, se assumirmos que nunca houve uma transição e que as regras gregorianas sempre governaram, temos um calendário gregoriano proléptico. É o que é usado pelo MySQL, conforme exigido pelo SQL padrão. Por essa razão, as datas anteriores à transição armazenadas como valores MySQL `DATE` ou `DATETIME` devem ser ajustadas para compensar a diferença. É importante perceber que a transição não ocorreu ao mesmo tempo em todos os países, e que quanto mais tarde ocorreu, mais dias foram perdidos. Por exemplo, na Grã-Bretanha, ocorreu em 1752, quando o Quarta-feira, 2 de setembro, foi seguido pelo Quinta-feira, 14 de setembro. A Rússia permaneceu no calendário juliano até 1918, perdendo 13 dias no processo, e o que é popularmente referido como sua “Revolução de Outubro” ocorreu em novembro, de acordo com o calendário gregoriano.

### 13.2.8 Conversão entre tipos de data e hora

Até certo ponto, você pode converter um valor de um tipo temporal para outro. No entanto, pode haver alguma alteração no valor ou perda de informações. Em todos os casos, a conversão entre tipos temporais está sujeita à faixa de valores válidos para o tipo resultante. Por exemplo, embora os valores `DATE`, `DATETIME` e `TIMESTAMP` possam ser especificados usando o mesmo conjunto de formatos, os tipos não têm todos a mesma faixa de valores. Os valores `TIMESTAMP` não podem ser anteriores a `1970` UTC ou posteriores a `'2038-01-19 03:14:07'` UTC. Isso significa que uma data como `'1968-01-01'`, embora válida como um valor de `DATE` ou `DATETIME`, não é válida como um valor de `TIMESTAMP` e é convertida para `0`.

Conversão dos valores de `DATE`:

* A conversão para um valor `DATETIME` ou `TIMESTAMP` adiciona uma parte de tempo de `'00:00:00'`, pois o valor `DATE` não contém informações de tempo.

* A conversão para um valor de `TIME` não é útil; o resultado é `'00:00:00'`.

Conversão dos valores de `DATETIME` e `TIMESTAMP`:

* A conversão para um valor `DATE` leva em conta os segundos fracionários e arredonda a parte do tempo. Por exemplo, `'1999-12-31 23:59:59.499'` se torna `'1999-12-31'`, enquanto `'1999-12-31 23:59:59.500'` se torna `'2000-01-01'`.

* A conversão para um valor `TIME` descarta a parte de data, porque o tipo `TIME` não contém informações de data.

Para a conversão dos valores de `TIME` para outros tipos temporais, o valor de `CURRENT_DATE()` é utilizado para a parte da data. O `TIME` é interpretado como tempo decorrido (não hora do dia) e adicionado à data. Isso significa que a parte da data do resultado difere da data atual se o valor de tempo estiver fora da faixa de `'00:00:00'` a `'23:59:59'`.

Suponha que a data atual seja `'2012-01-01'`. Os valores de `'12:00:00'`, `'24:00:00'` e `'-12:00:00'` de `TIME`, quando convertidos para valores de `DATETIME` ou `TIMESTAMP`, resultam em `'2012-01-01 12:00:00'`, `'2012-01-02 00:00:00'` e `'2011-12-31 12:00:00'`, respectivamente.

A conversão de `TIME` para `DATE` é semelhante, mas descarta a parte do tempo do resultado: `'2012-01-01'`, `'2012-01-02'` e `'2011-12-31'`, respectivamente.

A conversão explícita pode ser usada para substituir a conversão implícita. Por exemplo, na comparação entre os valores de `DATE` e `DATETIME`, o valor de `DATE` é convertido para o tipo `DATETIME` adicionando uma parte de tempo de `'00:00:00'`. Para realizar a comparação ignorando a parte de tempo do valor de `DATETIME`, use a função `CAST()` da seguinte maneira:

```
date_col = CAST(datetime_col AS DATE)
```

A conversão dos valores de `TIME` e `DATETIME` para forma numérica (por exemplo, adicionando `+0`) depende de se o valor contém uma parte de segundos fracionários. `TIME(N)` ou `DATETIME(N)` é convertido para inteiro quando *`N`* é 0 (ou omitido) e para um valor de `DECIMAL` com dígitos decimais de *`N`* quando *`N`* é maior que 0:

```
mysql> SELECT CURTIME(), CURTIME()+0, CURTIME(3)+0;
+-----------+-------------+--------------+
| CURTIME() | CURTIME()+0 | CURTIME(3)+0 |
+-----------+-------------+--------------+
| 09:28:00  |       92800 |    92800.887 |
+-----------+-------------+--------------+
mysql> SELECT NOW(), NOW()+0, NOW(3)+0;
+---------------------+----------------+--------------------+
| NOW()               | NOW()+0        | NOW(3)+0           |
+---------------------+----------------+--------------------+
| 2012-08-15 09:28:00 | 20120815092800 | 20120815092800.889 |
+---------------------+----------------+--------------------+
```

### 13.2.9 Anos de 2 dígitos em datas

Os valores de data com anos de 2 dígitos são ambíguos porque o século é desconhecido. Esses valores devem ser interpretados na forma de 4 dígitos, pois o MySQL armazena os anos internamente usando 4 dígitos.

Para os tipos `DATETIME`, `DATE` e `TIMESTAMP`, o MySQL interpreta as datas especificadas com valores de ano ambíguos usando essas regras:

* Os valores do ano na faixa `00-69` se tornam `2000-2069`.

* Os valores do ano na faixa `70-99` se tornam `1970-1999`.

Para `YEAR`, as regras são as mesmas, com esta exceção: um `00` numérico inserido em `YEAR` resulta em `0000` em vez de `2000`. Para especificar zero para `YEAR` e interpretá-lo como `2000`, especifique-o como uma string `'0'` ou `'00'`.

Lembre-se de que essas regras são apenas heurísticas que fornecem suposições razoáveis sobre o que significam seus valores de dados. Se as regras usadas pelo MySQL não produzem os valores que você precisa, você deve fornecer uma entrada inequívoca contendo valores de ano de 4 dígitos.

`ORDER BY` classifica corretamente os valores de `YEAR` que têm anos de 2 dígitos.

Algumas funções, como `MIN()` e `MAX()`, convertem um `YEAR` em um número. Isso significa que um valor com ano de 2 dígitos não funciona corretamente com essas funções. A correção neste caso é converter o `YEAR` para o formato de ano de 4 dígitos.