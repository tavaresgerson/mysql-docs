### 11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP

Os tipos `DATE`, `DATETIME` e `TIMESTAMP` estão relacionados. Esta seção descreve suas características, suas semelhanças e suas diferenças. O MySQL reconhece valores `DATE`, `DATETIME` e `TIMESTAMP` em vários formatos, descritos na Seção 9.1.3, “Literais de Data e Hora”. Para as descrições de intervalo de `DATE` e `DATETIME`, “suportado” significa que, embora valores anteriores possam funcionar, não há garantia.

O tipo `DATE` é usado para valores que contêm uma parte de data, mas nenhuma parte de hora. O MySQL recupera e exibe valores `DATE` no formato `'YYYY-MM-DD'`. O intervalo suportado é de `'1000-01-01'` a `'9999-12-31'`.

O tipo `DATETIME` é usado para valores que contêm partes de data e hora. O MySQL recupera e exibe valores `DATETIME` no formato `'YYYY-MM-DD hh:mm:ss'`. O intervalo suportado é de `'1000-01-01 00:00:00'` a `'9999-12-31 23:59:59'`.

O tipo de dado `TIMESTAMP` é usado para valores que contêm partes de data e hora. O `TIMESTAMP` possui um intervalo de `'1970-01-01 00:00:01'` UTC até `'2038-01-19 03:14:07'` UTC.

Um valor `DATETIME` ou `TIMESTAMP` pode incluir uma parte de segundos fracionários no final com precisão de até microssegundos (6 dígitos). Em particular, qualquer parte fracionária em um valor inserido em uma coluna `DATETIME` ou `TIMESTAMP` é armazenada em vez de descartada. Com a parte fracionária incluída, o formato para esses valores é `'YYYY-MM-DD hh:mm:ss[.fraction]'`, o intervalo para valores `DATETIME` é de `'1000-01-01 00:00:00.000000'` a `'9999-12-31 23:59:59.499999'`, e o intervalo para valores `TIMESTAMP` é de `'1970-01-01 00:00:01.000000'` a `'2038-01-19 03:14:07.499999'`. A parte fracionária deve ser sempre separada do restante da hora por um ponto decimal; nenhum outro delimitador de segundos fracionários é reconhecido. Para obter informações sobre o suporte a segundos fracionários no MySQL, consulte a Seção 11.2.7, “Segundos Fracionários em Valores de Tempo”.

Os tipos de dados `TIMESTAMP` e `DATETIME` oferecem inicialização automática e atualização para a data e hora atuais. Para mais informações, consulte a Seção 11.2.6, “Inicialização Automática e Atualização para TIMESTAMP e DATETIME”.

O MySQL converte valores `TIMESTAMP` do *time zone* atual para UTC para armazenamento, e de volta de UTC para o *time zone* atual para recuperação. (Isso não ocorre para outros tipos, como `DATETIME`.) Por padrão, o *time zone* atual para cada conexão é o *time zone* do server. O *time zone* pode ser configurado por conexão. Contanto que a configuração do *time zone* permaneça constante, você recuperará o mesmo valor que armazenou. Se você armazenar um valor `TIMESTAMP` e, em seguida, alterar o *time zone* e recuperar o valor, o valor recuperado será diferente do valor que você armazenou. Isso ocorre porque o mesmo *time zone* não foi usado para conversão em ambas as direções. O *time zone* atual está disponível como o valor da variável de sistema `time_zone`. Para mais informações, consulte a Seção 5.1.13, “Suporte a Time Zone do MySQL Server”.

Valores inválidos de `DATE`, `DATETIME` ou `TIMESTAMP` são convertidos para o valor “zero” do tipo apropriado (`'0000-00-00'` ou `'0000-00-00 00:00:00'`), se o SQL mode permitir essa conversão. O comportamento exato depende de quais, se houver, o *strict SQL mode* e o `NO_ZERO_DATE` SQL mode estão habilitados; consulte a Seção 5.1.10, “Server SQL Modes”.

Esteja ciente de certas propriedades da interpretação de valores de data no MySQL:

*   O MySQL permite um formato "flexível" (*relaxed*) para valores especificados como strings, no qual qualquer caractere de pontuação pode ser usado como delimitador entre partes de data ou partes de hora. Em alguns casos, essa sintaxe pode ser enganosa. Por exemplo, um valor como `'10:11:12'` pode parecer um valor de hora por causa dos `:`, mas é interpretado como o ano `'2010-11-12'` se usado em um contexto de data. O valor `'10:45:15'` é convertido para `'0000-00-00'` porque `'45'` não é um mês válido.

    O único delimitador reconhecido entre uma parte de data e hora e uma parte de segundos fracionários é o ponto decimal.

*   O *server* exige que os valores de mês e dia sejam válidos, e não apenas nos intervalos de 1 a 12 e 1 a 31, respectivamente. Com o *strict mode* desabilitado, datas inválidas como `'2004-04-31'` são convertidas para `'0000-00-00'` e um *warning* é gerado. Com o *strict mode* habilitado, datas inválidas geram um *error*. Para permitir tais datas, habilite `ALLOW_INVALID_DATES`. Consulte a Seção 5.1.10, “Server SQL Modes”, para mais informações.

*   O MySQL não aceita valores `TIMESTAMP` que incluam um zero na coluna do dia ou do mês, ou valores que não sejam uma data válida. A única exceção a esta regra é o valor especial “zero” `'0000-00-00 00:00:00'`, se o SQL mode permitir este valor. O comportamento exato depende de quais, se houver, o *strict SQL mode* e o `NO_ZERO_DATE` SQL mode estão habilitados; consulte a Seção 5.1.10, “Server SQL Modes”.

*   Datas contendo valores de ano com 2 dígitos são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano de 2 dígitos usando estas regras:

    + Valores de ano no intervalo `00-69` tornam-se `2000-2069`.

    + Valores de ano no intervalo `70-99` tornam-se `1970-1999`.

    Consulte também a Seção 11.2.10, “Anos de 2 Dígitos em Datas”.

Nota

O MySQL server pode ser executado com o `MAXDB` SQL mode habilitado. Neste caso, `TIMESTAMP` é idêntico a `DATETIME`. Se este *mode* estiver habilitado no momento da criação de uma table, as colunas `TIMESTAMP` são criadas como colunas `DATETIME`. Como resultado, essas colunas usam o formato de exibição `DATETIME`, têm o mesmo intervalo de valores e não há inicialização ou atualização automática para a data e hora atuais. Consulte a Seção 5.1.10, “Server SQL Modes”.

Nota

A partir do MySQL 5.7.22, `MAXDB` está depreciado; espere que ele seja removido em uma futura versão do MySQL.