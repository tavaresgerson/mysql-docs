### 11.1.3 Literais de Data e Hora

* Literais de Data e Hora do SQL Padrão e ODBC
* Literais de String e Numéricos no Contexto de Data e Hora

Os valores de data e hora podem ser representados em vários formatos, como strings com aspas ou como números, dependendo do tipo exato do valor e de outros fatores. Por exemplo, em contextos em que o MySQL espera uma data, ele interpreta qualquer uma das seguintes como uma data: `'2015-07-21'`, `'20150721'` e `20150721`.

Esta seção descreve os formatos aceitáveis para literais de data e hora. Para obter mais informações sobre os tipos de dados temporais, como a faixa de valores permitidos, consulte a Seção 13.2, “Tipos de Dados de Data e Hora”.

#### Literais de Data e Hora do SQL Padrão e ODBC

O SQL Padrão exige que os literais temporais sejam especificados usando uma palavra-chave de tipo e uma string. O espaço entre a palavra-chave e a string é opcional.

```
DATE 'str'
TIME 'str'
TIMESTAMP 'str'
```

O MySQL reconhece, mas, ao contrário do SQL Padrão, não requer a palavra-chave de tipo. As aplicações que devem ser compatíveis com o padrão devem incluir a palavra-chave de tipo para literais temporais.

O MySQL também reconhece a sintaxe ODBC correspondente à sintaxe do SQL Padrão:

```
{ d 'str' }
{ t 'str' }
{ ts 'str' }
```

O MySQL usa as palavras-chave de tipo e as construções ODBC para produzir valores `DATE`, `TIME` e `DATETIME`, respectivamente, incluindo uma parte fracionária de segundos final se especificada. A sintaxe `TIMESTAMP` produz um valor `DATETIME` no MySQL porque `DATETIME` tem uma faixa que corresponde mais de perto ao tipo `TIMESTAMP` do SQL Padrão, que tem uma faixa de ano de `0001` a `9999`. (A faixa de ano do `TIMESTAMP` do MySQL é `1970` a `2038`.)

#### Literais de String e Numéricos no Contexto de Data e Hora

O MySQL reconhece valores `DATE` nesses formatos:

* Como uma string no formato `'YYYY-MM-DD'` ou `'YY-MM-DD'`. Uma sintaxe "relaxada" é permitida, mas é desaconselhada: Qualquer caractere de pontuação pode ser usado como delimitador entre as partes da data. Por exemplo, `'2012-12-31'`, `'2012/12/31'`, `'2012^12^31'` e `'2012@12@31'` são equivalentes. O uso de qualquer caractere diferente da vírgula (`-`) como delimitador eleva uma advertência, como mostrado aqui:

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
* Como uma string sem delimitadores no formato `'YYYYMMDD'` ou `'YYMMDD'`, desde que a string faça sentido como uma data. Por exemplo, `'20070523'` e `'070523'` são interpretados como `'2007-05-23'`, mas `'071332'` é ilegal (tem partes de mês e dia sem sentido) e se torna `'0000-00-00'`.
* Como um número no formato *`YYYYMMDD`* ou *`YYMMDD`*, desde que o número faça sentido como uma data. Por exemplo, `19830905` e `830905` são interpretados como `'1983-09-05'`.

O MySQL reconhece  valores `DATETIME` e `TIMESTAMP` nesses formatos:

* Como uma string no formato `'YYYY-MM-DD hh:mm:ss'` ou `'YY-MM-DD hh:mm:ss'`. O MySQL também permite uma sintaxe "relaxada" aqui, embora isso seja desaconselhado: Qualquer caractere de pontuação pode ser usado como delimitador entre as partes da data ou das partes de hora. Por exemplo, `'2012-12-31 11:30:45'`, `'2012^12^31 11+30+45'`, `'2012/12/31 11*30*45'`, e `'2012@12@31 11^30^45'` são equivalentes. O uso de qualquer caractere como delimitador em tais valores, além da vírgula (`-`) para a parte da data e a vírgula (`:`) para a parte da hora, eleva uma advertência, como mostrado aqui:

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

Anteriormente, o MySQL suportava um número arbitrário de caracteres de espaço em branco no início e no final dos valores de data e hora, bem como entre as partes de data e hora dos valores `DATETIME` e `TIMESTAMP`. No MySQL 8.4, esse comportamento é desaconselhado, e a presença de caracteres de espaço em branco em excesso aciona uma mensagem de aviso, como mostrado aqui:

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

Uma mensagem de aviso também é exibida quando caracteres de espaço em branco, além do caractere de espaço, são usados, como este:

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

Apenas uma mensagem de aviso é exibida por valor temporal, mesmo que existam vários problemas com delimitadores, espaço em branco ou ambos, como mostrado na seguinte série de declarações:

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
  ```3AV6bX9haO```

O deslocamento não é exibido ao selecionar um valor de data e hora, mesmo que tenha sido usado ao inseri-lo.

O intervalo de valores de deslocamento suportados é de `-13:59` a `+14:00`, inclusive.

Os literais de data e hora que incluem deslocamentos de fuso horário são aceitos como valores de parâmetro por declarações preparadas.