### 9.1.3 Literais de Data e Hora

* Literais de DATE e TIME do SQL Padrão e ODBC
* Literais de String e Numéricos em Contextos de Data e Hora

Valores de data e hora podem ser representados em diversos formatos, como strings entre aspas ou como números, dependendo do tipo exato do valor e de outros fatores. Por exemplo, em contextos onde o MySQL espera uma data, ele interpreta qualquer um de `'2015-07-21'`, `'20150721'` e `20150721` como uma data.

Esta seção descreve os formatos aceitáveis para literais de data e hora. Para mais informações sobre os tipos de dados temporais, como o range de valores permitidos, consulte a Seção 11.2, “Date and Time Data Types”.

#### Literais de Data e Hora do SQL Padrão e ODBC

O SQL padrão exige que os literais temporais sejam especificados usando uma palavra-chave de tipo e uma string. O espaço entre a palavra-chave e a string é opcional.

```sql
DATE 'str'
TIME 'str'
TIMESTAMP 'str'
```

O MySQL reconhece, mas, diferentemente do SQL padrão, não exige a palavra-chave de tipo. Aplicações que buscam conformidade com o padrão devem incluir a palavra-chave de tipo para literais temporais.

O MySQL também reconhece a sintaxe ODBC correspondente à sintaxe do SQL padrão:

```sql
{ d 'str' }
{ t 'str' }
{ ts 'str' }
```

O MySQL usa as palavras-chave de tipo e as construções ODBC para produzir valores `DATE`, `TIME` e `DATETIME`, respectivamente, incluindo uma parte final de segundos fracionários, se especificada. A sintaxe `TIMESTAMP` produz um valor `DATETIME` no MySQL porque `DATETIME` possui um range que corresponde mais de perto ao tipo `TIMESTAMP` do SQL padrão, que tem um range de ano de `0001` a `9999`. (O range de ano do `TIMESTAMP` do MySQL é `1970` a `2038`.)

#### Literais de String e Numéricos em Contexto de Data e Hora

O MySQL reconhece valores `DATE` nestes formatos:

* Como uma string no formato `'YYYY-MM-DD'` ou `'YY-MM-DD'`. Uma sintaxe "relaxada" é permitida: Qualquer caractere de pontuação pode ser usado como delimiter entre as partes da data. Por exemplo, `'2012-12-31'`, `'2012/12/31'`, `'2012^12^31'` e `'2012@12@31'` são equivalentes.

* Como uma string sem delimiters, no formato `'YYYYMMDD'` ou `'YYMMDD'`, desde que a string faça sentido como uma data. Por exemplo, `'20070523'` e `'070523'` são interpretados como `'2007-05-23'`, mas `'071332'` é ilegal (possui partes de mês e dia sem sentido) e se torna `'0000-00-00'`.

* Como um número no formato *`YYYYMMDD`* ou *`YYMMDD`*, desde que o número faça sentido como uma data. Por exemplo, `19830905` e `830905` são interpretados como `'1983-09-05'`.

O MySQL reconhece valores `DATETIME` e `TIMESTAMP` nestes formatos:

* Como uma string no formato `'YYYY-MM-DD hh:mm:ss'` ou `'YY-MM-DD hh:mm:ss'`. Uma sintaxe "relaxada" também é permitida aqui: Qualquer caractere de pontuação pode ser usado como delimiter entre as partes da data ou as partes da hora. Por exemplo, `'2012-12-31 11:30:45'`, `'2012^12^31 11+30+45'`, `'2012/12/31 11*30*45'` e `'2012@12@31 11^30^45'` são equivalentes.

  O único delimiter reconhecido entre a parte de data e hora e uma parte de segundos fracionários é o ponto decimal.

  As partes de data e hora podem ser separadas por `T` em vez de um espaço. Por exemplo, `'2012-12-31 11:30:45'` e `'2012-12-31T11:30:45'` são equivalentes.

* Como uma string sem delimiters nos formatos `'YYYYMMDDhhmmss'` ou `'YYMMDDhhmmss'`, desde que a string faça sentido como uma data. Por exemplo, `'20070523091528'` e `'070523091528'` são interpretados como `'2007-05-23 09:15:28'`, mas `'071122129015'` é ilegal (possui uma parte de minuto sem sentido) e se torna `'0000-00-00 00:00:00'`.

* Como um número no formato *`YYYYMMDDhhmmss`* ou *`YYMMDDhhmmss`*, desde que o número faça sentido como uma data. Por exemplo, `19830905132800` e `830905132800` são interpretados como `'1983-09-05 13:28:00'`.

Um valor `DATETIME` ou `TIMESTAMP` pode incluir uma parte final de segundos fracionários com precisão de até microssegundos (6 dígitos). A parte fracionária deve ser sempre separada do restante da hora por um ponto decimal; nenhum outro delimiter de segundos fracionários é reconhecido. Para informações sobre suporte a segundos fracionários no MySQL, consulte a Seção 11.2.7, “Fractional Seconds in Time Values”.

Datas que contêm valores de ano de dois dígitos são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano de dois dígitos usando estas regras:

* Valores de ano no range `70-99` tornam-se `1970-1999`.

* Valores de ano no range `00-69` tornam-se `2000-2069`.

Consulte também a Seção 11.2.10, “2-Digit Years in Dates”.

Para valores especificados como strings que incluem delimiters de parte da data, não é necessário especificar dois dígitos para valores de mês ou dia que sejam menores que `10`. `'2015-6-9'` é o mesmo que `'2015-06-09'`. Da mesma forma, para valores especificados como strings que incluem delimiters de parte da hora, não é necessário especificar dois dígitos para valores de hora, minuto ou segundo que sejam menores que `10`. `'2015-10-30 1:2:3'` é o mesmo que `'2015-10-30 01:02:03'`.

Valores especificados como números devem ter 6, 8, 12 ou 14 dígitos. Se um número tiver 8 ou 14 dígitos, presume-se que esteja no formato *`YYYYMMDD`* ou *`YYYYMMDDhhmmss`* e que o ano seja fornecido pelos primeiros 4 dígitos. Se o número tiver 6 ou 12 dígitos, presume-se que esteja no formato *`YYMMDD`* ou *`YYMMDDhhmmss`* e que o ano seja fornecido pelos primeiros 2 dígitos. Números que não possuem um desses comprimentos são interpretados como se fossem preenchidos com zeros à esquerda até o comprimento mais próximo.

Valores especificados como strings sem delimiter são interpretados de acordo com seu comprimento. Para uma string de 8 ou 14 caracteres, presume-se que o ano seja fornecido pelos primeiros 4 caracteres. Caso contrário, presume-se que o ano seja fornecido pelos primeiros 2 caracteres. A string é interpretada da esquerda para a direita para encontrar valores de ano, mês, dia, hora, minuto e segundo, para tantas partes quantas estiverem presentes na string. Isso significa que você não deve usar strings que tenham menos de 6 caracteres. Por exemplo, se você especificar `'9903'`, pensando que representa Março de 1999, o MySQL o converte para o valor de data "zero". Isso ocorre porque os valores de ano e mês são `99` e `03`, mas a parte do dia está completamente ausente. No entanto, você pode especificar explicitamente um valor zero para representar partes de mês ou dia ausentes. Por exemplo, para inserir o valor `'1999-03-00'`, use `'990300'`.

O MySQL reconhece valores `TIME` nestes formatos:

* Como uma string no formato *`'D hh:mm:ss'`*. Você também pode usar uma das seguintes sintaxes "relaxadas": *`'hh:mm:ss'`*, *`'hh:mm'`*, *`'D hh:mm'`*, *`'D hh'`* ou *`'ss'`*. Aqui, *`D`* representa dias e pode ter um valor de 0 a 34.

* Como uma string sem delimiters no formato *`'hhmmss'`*, desde que faça sentido como uma hora. Por exemplo, `'101112'` é entendido como `'10:11:12'`, mas `'109712'` é ilegal (possui uma parte de minuto sem sentido) e se torna `'00:00:00'`.

* Como um número no formato *`hhmmss`*, desde que faça sentido como uma hora. Por exemplo, `101112` é entendido como `'10:11:12'`. Os seguintes formatos alternativos também são entendidos: *`ss`*, *`mmss`* ou *`hhmmss`*.

Uma parte final de segundos fracionários é reconhecida nos formatos de hora *`'D hh:mm:ss.fraction'`*, *`'hh:mm:ss.fraction'`*, *`'hhmmss.fraction'`* e *`hhmmss.fraction`*, onde `fraction` é a parte fracionária com precisão de até microssegundos (6 dígitos). A parte fracionária deve ser sempre separada do restante da hora por um ponto decimal; nenhum outro delimiter de segundos fracionários é reconhecido. Para informações sobre suporte a segundos fracionários no MySQL, consulte a Seção 11.2.7, “Fractional Seconds in Time Values”.

Para valores `TIME` especificados como strings que incluem um delimiter de parte da hora, não é necessário especificar dois dígitos para valores de hora, minuto ou segundo que sejam menores que `10`. `'8:3:2'` é o mesmo que `'08:03:02'`.