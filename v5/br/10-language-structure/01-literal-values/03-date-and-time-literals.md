### 9.1.3 Datas e Horários Literais

- Literais de data e hora padrão do SQL e ODBC
- Literais de cadeia e literais numéricos no contexto de data e hora

Os valores de data e hora podem ser representados em vários formatos, como strings com aspas ou como números, dependendo do tipo exato do valor e de outros fatores. Por exemplo, em contextos em que o MySQL espera uma data, ele interpreta qualquer uma das seguintes como uma data: `'2015-07-21'`, `'20150721'` e `20150721`.

Esta seção descreve os formatos aceitáveis para literais de data e hora. Para obter mais informações sobre os tipos de dados temporais, como a faixa de valores permitidos, consulte a Seção 11.2, “Tipos de Dados de Data e Hora”.

#### Literais de data e hora padrão do SQL e ODBC

O SQL padrão exige que os literais temporais sejam especificados usando uma palavra-chave de tipo e uma string. O espaço entre a palavra-chave e a string é opcional.

```sql
DATE 'str'
TIME 'str'
TIMESTAMP 'str'
```

O MySQL reconhece, mas, ao contrário do SQL padrão, não exige a palavra-chave tipo. As aplicações que devem ser compatíveis com o padrão devem incluir a palavra-chave tipo para literais temporais.

O MySQL também reconhece a sintaxe ODBC correspondente à sintaxe SQL padrão:

```sql
{ d 'str' }
{ t 'str' }
{ ts 'str' }
```

O MySQL utiliza as palavras-chave tipo e as construções ODBC para produzir valores `DATE`, `TIME` e `DATETIME`, respectivamente, incluindo uma parte fracionária de segundos no final, se especificada. A sintaxe `TIMESTAMP` produz um valor `DATETIME` no MySQL porque `DATETIME` tem uma faixa que corresponde mais de perto ao tipo padrão `TIMESTAMP` do SQL, que tem uma faixa de ano de `0001` a `9999`. (A faixa de ano do `TIMESTAMP` do MySQL é de `1970` a `2038`.)

#### Literais de cadeia e literais numéricos no contexto de data e hora

O MySQL reconhece os valores `DATE` nestes formatos:

- Como uma cadeia no formato `'YYYY-MM-DD'` ou `'YY-MM-DD'`. É permitida uma sintaxe "relaxada": qualquer caractere de pontuação pode ser usado como delimitador entre as partes da data. Por exemplo, `'2012-12-31'`, `'2012/12/31'`, `'2012^12^31'` e `'2012@12@31'` são equivalentes.

- Como uma string sem delimitadores no formato `'YYYYMMDD'` ou `'YYMMDD'`, desde que a string faça sentido como uma data. Por exemplo, `'20070523'` e `'070523'` são interpretados como `'2007-05-23'`, mas `'071332'` é ilegal (tem partes de mês e dia sem sentido) e se torna `'0000-00-00'`.

- Como um número no formato *`YYYYMMDD`* ou *`YYMMDD`*, desde que o número faça sentido como uma data. Por exemplo, `19830905` e `830905` são interpretados como `'1983-09-05'`.

O MySQL reconhece os valores `DATETIME` e `TIMESTAMP` nesses formatos:

- Como uma string no formato `'YYYY-MM-DD hh:mm:ss'` ou `'YY-MM-DD hh:mm:ss'`. Aqui, também é permitida uma sintaxe "relaxada": qualquer caractere de pontuação pode ser usado como delimitador entre partes da data ou partes do horário. Por exemplo, `'2012-12-31 11:30:45'`, `'2012^12^31 11+30+45'`, `'2012/12/31 11*30*45'` e `'2012@12@31 11^30^45'` são equivalentes.

  O único delimitador reconhecido entre uma parte de data e hora e uma parte de segundos fracionários é o ponto decimal.

  As partes de data e hora podem ser separadas por `T` em vez de um espaço. Por exemplo, `'2012-12-31 11:30:45'` e `'2012-12-31T11:30:45'` são equivalentes.

- Como uma string sem delimitadores no formato `'YYYYMMDDhhmmss'` ou `'YYMMDDhhmmss'`, desde que a string faça sentido como uma data. Por exemplo, `'20070523091528'` e `'070523091528'` são interpretados como `'2007-05-23 09:15:28'`, mas `'071122129015'` é ilegal (tem uma parte de minuto sem sentido) e se torna `'0000-00-00 00:00:00'`.

- Como um número no formato *`YYYYMMDDhhmmss`* ou *`YYMMDDhhmmss`*, desde que o número faça sentido como uma data. Por exemplo, `19830905132800` e `830905132800` são interpretados como `'1983-09-05 13:28:00'`.

Um valor `DATETIME` ou `TIMESTAMP` pode incluir uma parte fracionária de segundos no final com precisão de até microsegundos (6 dígitos). A parte fracionária deve ser sempre separada do resto do tempo por um ponto decimal; nenhum outro delimitador de segundos fracionários é reconhecido. Para obter informações sobre o suporte a segundos fracionários no MySQL, consulte a Seção 11.2.7, “Segundos Fracionários em Valores de Tempo”.

As datas que contêm valores de ano de duas casas decimais são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano de duas casas decimais seguindo estas regras:

- Os valores do ano na faixa `70-99` se tornam `1970-1999`.

- Os valores do ano na faixa `00-69` se tornam `2000-2069`.

Veja também a Seção 11.2.10, “Anos de 2 dígitos em datas”.

Para valores especificados como cadeias de caracteres que incluem delimitadores de parte de data, não é necessário especificar dois dígitos para valores de mês ou dia que são menores que `10`. `'2015-6-9'` é o mesmo que `'2015-06-09'`. Da mesma forma, para valores especificados como cadeias de caracteres que incluem delimitadores de parte de hora, não é necessário especificar dois dígitos para valores de hora, minuto ou segundo que são menores que `10`. `'2015-10-30 1:2:3'` é o mesmo que `'2015-10-30 01:02:03'`.

Os valores especificados como números devem ter 6, 8, 12 ou 14 dígitos. Se um número tiver 8 ou 14 dígitos, presume-se que esteja no formato *`YYYYMMDD`* ou *`YYYYMMDDhhmmss`* e que o ano seja dado pelos primeiros 4 dígitos. Se o número tiver 6 ou 12 dígitos, presume-se que esteja no formato *`YYMMDD`* ou *`YYMMDDhhmmss`* e que o ano seja dado pelos primeiros 2 dígitos. Números que não tenham essas comprimentos são interpretados como se estivessem preenchidos com zeros à frente até o comprimento mais próximo.

Os valores especificados como cadeias de texto não delimitadas são interpretados de acordo com sua comprimento. Para uma cadeia de texto de 8 ou 14 caracteres, o ano é assumido como sendo dado pelos primeiros 4 caracteres. Caso contrário, o ano é assumido como sendo dado pelos primeiros 2 caracteres. A cadeia é interpretada da esquerda para a direita para encontrar os valores do ano, mês, dia, hora, minuto e segundo, para tantas partes quanto estiverem presentes na cadeia. Isso significa que você não deve usar cadeias que tenham menos de 6 caracteres. Por exemplo, se você especificar `'9903'`, pensando que isso representa março de 1999, o MySQL a converte para o valor de data “zero”. Isso ocorre porque os valores do ano e do mês são `99` e `03`, mas a parte do dia está completamente ausente. No entanto, você pode especificar explicitamente um valor de zero para representar partes do mês ou do dia ausentes. Por exemplo, para inserir o valor `'1999-03-00'`, use `'990300'`.

O MySQL reconhece os valores `TIME` nesses formatos:

- Como uma string no formato *`'D hh:mm:ss'`*. Você também pode usar uma das seguintes sintáticas "relaxadas": \*`'hh:mm:ss'`, \*`'hh:mm'`, \*`'D hh:mm'`, \*`'D hh'`, ou \*`'ss'`. Aqui *`D`* representa dias e pode ter um valor de 0 a 34.

- Como uma string sem delimitadores no formato *`'hhmmss'`*, desde que faça sentido como uma hora. Por exemplo, `'101112'` é entendido como `'10:11:12'`, mas `'109712'` é ilegal (tem uma parte de minuto sem sentido) e se torna `'00:00:00'`.

- Como um número no formato *`hhmmss``, desde que faça sentido como uma hora. Por exemplo, `101112`é entendido como`'10:11:12'`. Os seguintes formatos alternativos também são entendidos: *`ss`*, *`mmss`* ou *`hhmmss\`*.

Uma parte fracionária de segundos é reconhecida nos formatos de hora *`'D hh:mm:ss.fraction'`*, *`'hh:mm:ss.fraction'`*, *`'hhmmss.fraction'`* e *`'hhmmss.fraction'`*, onde `fraction` é a parte fracionária em precisão de até microsegundos (6 dígitos). A parte fracionária deve ser sempre separada do resto da hora por um ponto decimal; nenhum outro delimitador de segundos fracionários é reconhecido. Para informações sobre o suporte a segundos fracionários no MySQL, consulte a Seção 11.2.7, “Segundos Fracionários em Valores de Hora”.

Para valores de `TIME` especificados como strings que incluem um delimitador de parte de hora, não é necessário especificar dois dígitos para horas, minutos ou valores de segundos que sejam menores que `10`. `'8:3:2'` é o mesmo que `'08:03:02'`.
