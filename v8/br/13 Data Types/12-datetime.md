### 13.2.2 Tipos `DATE`, `DATETIME` e `TIMESTAMP`

Os tipos `DATE`, `DATETIME` e `TIMESTAMP` estão relacionados. Esta seção descreve suas características, como eles são semelhantes e como eles diferem. O MySQL reconhece valores `DATE`, `DATETIME` e `TIMESTAMP` em vários formatos, descritos na Seção 11.1.3, “Literais de Data e Hora”. Para as descrições de intervalos de `DATE` e `DATETIME`, “suportável” significa que, embora valores anteriores possam funcionar, não há garantia.

O tipo `DATE` é usado para valores com uma parte de data, mas sem parte de hora. O MySQL recupera e exibe valores `DATE` no formato `'YYYY-MM-DD'`. O intervalo suportado é `'1000-01-01'` a `'9999-12-31'`.

O tipo `DATETIME` é usado para valores que contêm tanto partes de data quanto de hora. O MySQL recupera e exibe valores `DATETIME` no formato `'YYYY-MM-DD hh:mm:ss'`. O intervalo suportado é `'1000-01-01 00:00:00'` a `'9999-12-31 23:59:59'`.

O tipo de dados `TIMESTAMP` é usado para valores que contêm tanto partes de data quanto de hora. `TIMESTAMP` tem um intervalo de `'1970-01-01 00:00:01'` UTC a `'2038-01-19 03:14:07'` UTC.

Um valor `DATETIME` ou `TIMESTAMP` pode incluir uma parte fracionária de segundos em até microsegundos (6 dígitos) de precisão. Em particular, qualquer parte fracionária em um valor inserido em uma coluna `DATETIME` ou `TIMESTAMP` é armazenada em vez de ser descartada. Com a parte fracionária incluída, o formato para esses valores é `'YYYY-MM-DD hh:mm:ss[.fraction]'`, o intervalo para valores `DATETIME` é `'1000-01-01 00:00:00.000000'` a `'9999-12-31 23:59:59.499999'`, e o intervalo para valores `TIMESTAMP` é `'1970-01-01 00:00:01.000000'` a `'2038-01-19 03:14:07.499999'`. A parte fracionária deve sempre ser separada do resto do tempo por um ponto decimal; nenhum outro delimitador de segundos fracionários é reconhecido. Para informações sobre o suporte de segundos fracionários no MySQL, consulte a Seção 13.2.6, “Segundos Fracionários em Valores de Hora”.

Os tipos de dados `TIMESTAMP` e `DATETIME` oferecem inicialização e atualização automáticas para a data e hora atuais. Para obter mais informações, consulte a Seção 13.2.5, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

O MySQL converte os valores `TIMESTAMP` da hora atual para o fuso horário UTC para armazenamento e de volta do UTC para o fuso horário atual para recuperação. (Isso não ocorre com outros tipos, como `DATETIME`.) Por padrão, o fuso horário atual para cada conexão é a hora do servidor. O fuso horário pode ser definido por conexão. Enquanto o ajuste do fuso horário permanecer constante, você receberá o mesmo valor que armazenou. Se você armazenar um valor `TIMESTAMP` e, em seguida, alterar o fuso horário e recuperar o valor, o valor recuperado será diferente do valor que você armazenou. Isso ocorre porque o mesmo fuso horário não foi usado para conversão em ambas as direções. O fuso horário atual está disponível como o valor da variável de sistema  `time_zone`. Para obter mais informações, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do Servidor MySQL”.

Você pode especificar um deslocamento de fuso horário ao inserir um valor `TIMESTAMP` ou `DATETIME` em uma tabela. Consulte a Seção 11.1.3, “Literais de Data e Hora”, para obter mais informações e exemplos.

Valores inválidos de `DATE`, `DATETIME` ou `TIMESTAMP` são convertidos para o valor “zero” do tipo apropriado (`'0000-00-00'` ou `'0000-00-00 00:00:00'`), se o modo SQL permitir essa conversão. O comportamento preciso depende de se o modo SQL rigoroso e o modo SQL  `NO_ZERO_DATE` estão habilitados; consulte a Seção 7.1.11, “Modos SQL do Servidor”.

Você pode converter valores `TIMESTAMP` para valores `DATETIME` UTC ao recuperá-los usando `CAST()` com o operador `AT TIME ZONE`, como mostrado aqui:

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

Para obter informações completas sobre sintaxe e exemplos adicionais, consulte a descrição da função `CAST()`.

Esteja ciente de certas propriedades da interpretação de valores de data no MySQL:

* O MySQL permite um formato "relaxado" para valores especificados como strings, em que qualquer caractere de pontuação pode ser usado como delimitador entre partes de data ou partes de hora. Em alguns casos, essa sintaxe pode ser enganadora. Por exemplo, um valor como `'10:11:12'` pode parecer um valor de hora devido ao `:`, mas é interpretado como o ano `'2010-11-12'` se usado em contexto de data. O valor `'10:45:15'` é convertido para `'0000-00-00'` porque `'45'` não é um mês válido.

  O único delimitador reconhecido entre uma parte de data e uma parte de hora e uma parte fracionária de segundos é o ponto decimal.
* O servidor exige que os valores de mês e dia sejam válidos e não apenas no intervalo de 1 a 12 e 1 a 31, respectivamente. Com o modo rigoroso desativado, datas inválidas como `'2004-04-31'` são convertidas para `'0000-00-00'` e um aviso é gerado. Com o modo rigoroso ativado, datas inválidas geram um erro. Para permitir tais datas, ative `ALLOW_INVALID_DATES`. Veja a Seção 7.1.11, “Modos SQL do Servidor”, para mais informações.
* O MySQL não aceita valores `TIMESTAMP` que incluam um zero na coluna de dia ou mês ou valores que não sejam uma data válida. A única exceção a essa regra é o valor especial "zero" `'0000-00-00 00:00:00'`, se o modo SQL permitir esse valor. O comportamento preciso depende de qual, se houver, o modo SQL rigoroso e o modo SQL `NO_ZERO_DATE` estão ativados; veja  Seção 7.1.11, “Modos SQL do Servidor”.
* Datas que contêm valores de ano de 2 dígitos são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano de 2 dígitos usando estas regras:

  + Valores de ano no intervalo `00-69` se tornam `2000-2069`.
  + Valores de ano no intervalo `70-99` se tornam `1970-1999`.

  Veja também  Seção 13.2.9, “Anos de 2 dígitos em Datas”.