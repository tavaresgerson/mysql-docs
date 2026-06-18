### 11.1.3 Datas e Horários Literais

- Literais de data e hora padrão do SQL e ODBC
- Literais de cadeia e literais numéricos no contexto de data e hora

Os valores de data e hora podem ser representados em vários formatos, como strings com aspas ou como números, dependendo do tipo exato do valor e de outros fatores. Por exemplo, em contextos em que o MySQL espera uma data, ele interpreta qualquer um dos `'2015-07-21'`, `'20150721'` e `20150721` como uma data.

Esta seção descreve os formatos aceitáveis para literais de data e hora. Para obter mais informações sobre os tipos de dados temporais, como a faixa de valores permitidos, consulte a Seção 13.2, “Tipos de Dados de Data e Hora”.

#### Literais de data e hora padrão do SQL e ODBC

O SQL padrão exige que os literais temporais sejam especificados usando uma palavra-chave de tipo e uma string. O espaço entre a palavra-chave e a string é opcional.

```
DATE 'str'
TIME 'str'
TIMESTAMP 'str'
```

O MySQL reconhece, mas, ao contrário do SQL padrão, não exige a palavra-chave tipo. As aplicações que devem ser compatíveis com o padrão devem incluir a palavra-chave tipo para literais temporais.

O MySQL também reconhece a sintaxe ODBC correspondente à sintaxe SQL padrão:

```
{ d 'str' }
{ t 'str' }
{ ts 'str' }
```

O MySQL utiliza as palavras-chave tipo e as construções ODBC para produzir os valores `DATE`, `TIME` e `DATETIME`, respectivamente, incluindo uma parte fracionária de segundos no final, se especificada. A sintaxe `TIMESTAMP` produz um valor `DATETIME` no MySQL porque `DATETIME` tem uma faixa que corresponde mais de perto ao tipo padrão SQL `TIMESTAMP`, que tem uma faixa de ano de `0001` a `9999`. (A faixa de ano do MySQL `TIMESTAMP` é de `1970` a `2038`.)

#### Literais de cadeia e literais numéricos no contexto de data e hora

O MySQL reconhece os valores `DATE` nesses formatos:

- Como uma cadeia em qualquer formato `'YYYY-MM-DD'` ou `'YY-MM-DD'`. Uma sintaxe "relaxada" é permitida, mas é desaconselhada: Qualquer caractere de pontuação pode ser usado como delimitador entre as partes da data. Por exemplo, `'2012-12-31'`, `'2012/12/31'`, `'2012^12^31'` e `'2012@12@31'` são equivalentes. A partir do MySQL 8.0.29, o uso de qualquer caractere diferente do hífen (`-`) como delimitador gera uma mensagem de aviso, conforme mostrado aqui:

  ```
  mysql> SELECT DATE'2012@12@31';
  +------------------+
  | DATE'2012@12@31' |
  +------------------+
  | 2012-12-31       |
  +------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 4095
  Message: Delimiter '@' in position 4 in datetime value '2012@12@31' at row 1 is
  deprecated. Prefer the standard '-'.
  1 row in set (0.00 sec)
  ```

- Como uma string sem delimitadores no formato `'YYYYMMDD'` ou `'YYMMDD'`, desde que a string faça sentido como uma data. Por exemplo, `'20070523'` e `'070523'` são interpretados como `'2007-05-23'`, mas `'071332'` é ilegal (tem partes de mês e dia sem sentido) e se torna `'0000-00-00'`.

- Como um número no formato `YYYYMMDD` ou `YYMMDD`, desde que o número faça sentido como uma data. Por exemplo, `19830905` e `830905` são interpretados como `'1983-09-05'`.

O MySQL reconhece os valores `DATETIME` e `TIMESTAMP` nesses formatos:

- Como uma string no formato `'YYYY-MM-DD hh:mm:ss'` ou `'YY-MM-DD hh:mm:ss'`. O MySQL também permite uma sintaxe "relaxada" aqui, embora isso seja desaconselhável: Qualquer caractere de pontuação pode ser usado como delimitador entre partes de data ou partes de hora. Por exemplo, `'2012-12-31 11:30:45'`, `'2012^12^31 11+30+45'`, `'2012/12/31 11*30*45'` e `'2012@12@31 11^30^45'` são equivalentes. A partir do MySQL 8.0.29, o uso de qualquer caractere como delimitador em tais valores, exceto o hífen (`-`) para a parte de data e a vírgula (`:`) para a parte de hora, gera uma mensagem de aviso, conforme mostrado aqui:

  ```
  mysql> SELECT TIMESTAMP'2012^12^31 11*30*45';
  +--------------------------------+
  | TIMESTAMP'2012^12^31 11*30*45' |
  +--------------------------------+
  | 2012-12-31 11:30:45            |
  +--------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 4095
  Message: Delimiter '^' in position 4 in datetime value '2012^12^31 11*30*45' at
  row 1 is deprecated. Prefer the standard '-'.
  1 row in set (0.00 sec)
  ```

  O único delimitador reconhecido entre uma parte de data e hora e uma parte de segundos fracionários é o ponto decimal.

  As partes de data e hora podem ser separadas por `T` em vez de um espaço. Por exemplo, `'2012-12-31 11:30:45'` `'2012-12-31T11:30:45'` são equivalentes.

  Anteriormente, o MySQL suportava um número arbitrário de caracteres de espaço em branco no início e no final dos valores de data e hora, bem como entre as partes de data e hora dos valores `DATETIME` e `TIMESTAMP`. No MySQL 8.0.29 e versões posteriores, esse comportamento é desaconselhável, e a presença de caracteres de espaço em branco em excesso aciona uma mensagem de aviso, conforme mostrado aqui:

  ```
  mysql> SELECT TIMESTAMP'2012-12-31   11-30-45';
  +----------------------------------+
  | TIMESTAMP'2012-12-31   11-30-45' |
  +----------------------------------+
  | 2012-12-31 11:30:45              |
  +----------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 4096
  Message: Delimiter ' ' in position 11 in datetime value '2012-12-31   11-30-45'
  at row 1 is superfluous and is deprecated. Please remove.
  1 row in set (0.00 sec)
  ```

  Além disso, a partir do MySQL 8.0.29, um aviso é exibido quando caracteres de espaço em branco, além do caractere de espaço, são usados, como este:

  ```
  mysql> SELECT TIMESTAMP'2021-06-06
      '> 11:15:25';
  +--------------------------------+
  | TIMESTAMP'2021-06-06
   11:15:25'                       |
  +--------------------------------+
  | 2021-06-06 11:15:25            |
  +--------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 4095
  Message: Delimiter '\n' in position 10 in datetime value '2021-06-06
  11:15:25' at row 1 is deprecated. Prefer the standard ' '.
  1 row in set (0.00 sec)
  ```

  Apenas uma advertência é emitida por valor temporal, mesmo que existam vários problemas com delimitadores, espaços em branco ou ambos, como mostrado na seguinte série de declarações:

  ```
  mysql> SELECT TIMESTAMP'2012!-12-31  11:30:45';
  +----------------------------------+
  | TIMESTAMP'2012!-12-31  11:30:45' |
  +----------------------------------+
  | 2012-12-31 11:30:45              |
  +----------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 4095
  Message: Delimiter '!' in position 4 in datetime value '2012!-12-31  11:30:45'
  at row 1 is deprecated. Prefer the standard '-'.
  1 row in set (0.00 sec)

  mysql> SELECT TIMESTAMP'2012-12-31  11:30:45';
  +---------------------------------+
  | TIMESTAMP'2012-12-31  11:30:45' |
  +---------------------------------+
  | 2012-12-31 11:30:45             |
  +---------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 4096
  Message: Delimiter ' ' in position 11 in datetime value '2012-12-31  11:30:45'
  at row 1 is superfluous and is deprecated. Please remove.
  1 row in set (0.00 sec)

  mysql> SELECT TIMESTAMP'2012-12-31 11:30:45';
  +--------------------------------+
  | TIMESTAMP'2012-12-31 11:30:45' |
  +--------------------------------+
  | 2012-12-31 11:30:45            |
  +--------------------------------+
  1 row in set (0.00 sec)
  ```

- Como uma string sem delimitadores no formato `'YYYYMMDDhhmmss'` ou `'YYMMDDhhmmss'`, desde que a string faça sentido como uma data. Por exemplo, `'20070523091528'` e `'070523091528'` são interpretados como `'2007-05-23 09:15:28'`, mas `'071122129015'` é ilegal (tem uma parte de minuto sem sentido) e se torna `'0000-00-00 00:00:00'`.

- Como um número no formato `YYYYMMDDhhmmss` ou `YYMMDDhhmmss`, desde que o número faça sentido como uma data. Por exemplo, `19830905132800` e `830905132800` são interpretados como `'1983-09-05 13:28:00'`.

Um valor `DATETIME` ou `TIMESTAMP` pode incluir uma parte fracionária de segundos no final, com precisão de até microsegundos (6 dígitos). A parte fracionária deve sempre ser separada do resto do tempo por um ponto decimal; nenhum outro delimitador de segundos fracionários é reconhecido. Para obter informações sobre o suporte a segundos fracionários no MySQL, consulte a Seção 13.2.6, “Segundos Fracionários em Valores de Tempo”.

As datas que contêm valores de ano de duas casas decimais são ambíguas porque o século é desconhecido. O MySQL interpreta valores de ano de duas casas decimais seguindo estas regras:

- Os valores do ano na faixa `70-99` se tornam `1970-1999`.

- Os valores do ano na faixa `00-69` se tornam `2000-2069`.

Veja também a Seção 13.2.9, “Anos de 2 dígitos em datas”.

Para valores especificados como cadeias de caracteres que incluem delimitadores de parte de data, não é necessário especificar dois dígitos para valores de mês ou dia que são menores que `10`. `'2015-6-9'` é o mesmo que `'2015-06-09'`. Da mesma forma, para valores especificados como cadeias de caracteres que incluem delimitadores de parte de hora, não é necessário especificar dois dígitos para valores de hora, minuto ou segundo que são menores que `10`. `'2015-10-30 1:2:3'` é o mesmo que `'2015-10-30 01:02:03'`.

Os valores especificados como números devem ter 6, 8, 12 ou 14 dígitos. Se um número tiver 8 ou 14 dígitos, presume-se que esteja no formato `YYYYMMDD` ou `YYYYMMDDhhmmss` e que o ano seja dado pelos primeiros 4 dígitos. Se o número tiver 6 ou 12 dígitos, presume-se que esteja no formato `YYMMDD` ou `YYMMDDhhmmss` e que o ano seja dado pelos primeiros 2 dígitos. Números que não tenham essas comprimentos são interpretados como se estivessem preenchidos com zeros à frente até o comprimento mais próximo.

Os valores especificados como cadeias de texto não delimitadas são interpretados de acordo com sua comprimento. Para uma cadeia de texto de 8 ou 14 caracteres, o ano é assumido como sendo dado pelos primeiros 4 caracteres. Caso contrário, o ano é assumido como sendo dado pelos primeiros 2 caracteres. A cadeia é interpretada da esquerda para a direita para encontrar os valores de ano, mês, dia, hora, minuto e segundo, para tantas partes quanto estiverem presentes na cadeia. Isso significa que você não deve usar cadeias que tenham menos de 6 caracteres. Por exemplo, se você especificar `'9903'`, pensando que isso representa março de 1999, o MySQL converte isso para o valor de data “zero”. Isso ocorre porque os valores de ano e mês são `99` e `03`, mas a parte do dia está completamente ausente. No entanto, você pode especificar explicitamente um valor de zero para representar partes de mês ou dia ausentes. Por exemplo, para inserir o valor `'1999-03-00'`, use `'990300'`.

O MySQL reconhece os valores `TIME` nesses formatos:

- Como uma cadeia no formato `'D hh:mm:ss'`. Você também pode usar uma das seguintes sintaxes "relaxadas": `'hh:mm:ss'`, `'hh:mm'`, `'D hh:mm'`, `'D hh'` ou `'ss'`. Aqui `D` representa dias e pode ter um valor de 0 a 34.

- Como uma string sem delimitadores no formato `'hhmmss'`, desde que faça sentido como uma hora. Por exemplo, `'101112'` é entendido como `'10:11:12'`, mas `'109712'` é ilegal (tem uma parte de minuto sem sentido) e se torna `'00:00:00'`.

- Como um número no formato `hhmmss`, desde que faça sentido como uma hora. Por exemplo, `101112` é entendido como `'10:11:12'`. Os seguintes formatos alternativos também são entendidos: `ss`, `mmss` ou `hhmmss`.

Uma parte fracionária de segundos é reconhecida nos formatos de tempo `'D hh:mm:ss.fraction'`, `'hh:mm:ss.fraction'`, `'hhmmss.fraction'` e `hhmmss.fraction`, onde `fraction` é a parte fracionária em precisão de até microsegundos (6 dígitos). A parte fracionária deve ser sempre separada do resto do tempo por um ponto decimal; nenhum outro delimitador de segundos fracionários é reconhecido. Para informações sobre o suporte a segundos fracionários no MySQL, consulte a Seção 13.2.6, “Segundos Fracionários em Valores de Tempo”.

Para valores `TIME` especificados como strings que incluem um delimitador de parte de tempo, não é necessário especificar dois dígitos para valores de horas, minutos ou segundos que são menores que `10`. `'8:3:2'` é o mesmo que `'08:03:02'`.

A partir do MySQL 8.0.19, você pode especificar um deslocamento de fuso horário ao inserir os valores `TIMESTAMP` e `DATETIME` em uma tabela. O deslocamento é anexado à parte do tempo de um literal datetime, sem espaços em branco, e usa o mesmo formato usado para definir a variável de sistema `time_zone`, com as seguintes exceções:

- Para valores de hora menores que 10, é necessário um zero inicial.
- O valor `'-00:00'` foi rejeitado.
- Nomes de fuso horário como `'EET'` e `'Asia/Shanghai'` não podem ser usados; `'SYSTEM'` também não pode ser usado nesse contexto.

O valor inserido não pode ter um zero na parte do mês, na parte do dia ou em ambas. Isso é exigido a partir do MySQL 8.0.22, independentemente da configuração do modo SQL do servidor.

Este exemplo ilustra a inserção de valores de data e hora com deslocamentos de fuso horário nas colunas `TIMESTAMP` e `DATETIME` usando diferentes configurações de `time_zone`, e depois a recuperação deles:

```
mysql> CREATE TABLE ts (
    ->     id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     col TIMESTAMP NOT NULL
    -> ) AUTO_INCREMENT = 1;

mysql> CREATE TABLE dt (
    ->     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     col DATETIME NOT NULL
    -> ) AUTO_INCREMENT = 1;

mysql> SET @@time_zone = 'SYSTEM';

mysql> INSERT INTO ts (col) VALUES ('2020-01-01 10:10:10'),
    ->     ('2020-01-01 10:10:10+05:30'), ('2020-01-01 10:10:10-08:00');

mysql> SET @@time_zone = '+00:00';

mysql> INSERT INTO ts (col) VALUES ('2020-01-01 10:10:10'),
    ->     ('2020-01-01 10:10:10+05:30'), ('2020-01-01 10:10:10-08:00');

mysql> SET @@time_zone = 'SYSTEM';

mysql> INSERT INTO dt (col) VALUES ('2020-01-01 10:10:10'),
    ->     ('2020-01-01 10:10:10+05:30'), ('2020-01-01 10:10:10-08:00');

mysql> SET @@time_zone = '+00:00';

mysql> INSERT INTO dt (col) VALUES ('2020-01-01 10:10:10'),
    ->     ('2020-01-01 10:10:10+05:30'), ('2020-01-01 10:10:10-08:00');

mysql> SET @@time_zone = 'SYSTEM';

mysql> SELECT @@system_time_zone;
+--------------------+
| @@system_time_zone |
+--------------------+
| EST                |
+--------------------+

mysql> SELECT col, UNIX_TIMESTAMP(col) FROM dt ORDER BY id;
+---------------------+---------------------+
| col                 | UNIX_TIMESTAMP(col) |
+---------------------+---------------------+
| 2020-01-01 10:10:10 |          1577891410 |
| 2019-12-31 23:40:10 |          1577853610 |
| 2020-01-01 13:10:10 |          1577902210 |
| 2020-01-01 10:10:10 |          1577891410 |
| 2020-01-01 04:40:10 |          1577871610 |
| 2020-01-01 18:10:10 |          1577920210 |
+---------------------+---------------------+

mysql> SELECT col, UNIX_TIMESTAMP(col) FROM ts ORDER BY id;
+---------------------+---------------------+
| col                 | UNIX_TIMESTAMP(col) |
+---------------------+---------------------+
| 2020-01-01 10:10:10 |          1577891410 |
| 2019-12-31 23:40:10 |          1577853610 |
| 2020-01-01 13:10:10 |          1577902210 |
| 2020-01-01 05:10:10 |          1577873410 |
| 2019-12-31 23:40:10 |          1577853610 |
| 2020-01-01 13:10:10 |          1577902210 |
+---------------------+---------------------+
```

O deslocamento não é exibido ao selecionar um valor de data e hora, mesmo que tenha sido usado ao inseri-lo.

A faixa de valores de deslocamento suportados é `-13:59` a `+14:00`, inclusive.

As datas e horas literais que incluem deslocamentos de fuso horário são aceitas como valores de parâmetro por instruções preparadas.
