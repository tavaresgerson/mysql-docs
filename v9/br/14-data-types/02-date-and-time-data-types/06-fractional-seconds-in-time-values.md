### 13.2.6 Segundos Fracionários em Valores de Tempo

O MySQL oferece suporte a segundos fracionários para os valores `TIME`, `DATETIME` e `TIMESTAMP`, com precisão de até microsegundos (6 dígitos):

* Para definir uma coluna que inclua uma parte de segundos fracionários, use a sintaxe `type_name(fsp)`, onde *`type_name`* é `TIME`, `DATETIME` ou `TIMESTAMP`, e *`fsp`* é a precisão de segundos fracionários. Por exemplo:

  ```
  CREATE TABLE t1 (t TIME(3), dt DATETIME(6));
  ```

  O valor de *`fsp`*, se fornecido, deve estar no intervalo de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão SQL padrão de 6, para compatibilidade com versões anteriores do MySQL.)

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

  Nenhum aviso ou erro é dado quando tal arredondamento ocorre. Esse comportamento segue o padrão SQL.

* Para inserir os valores com truncação em vez disso, habilite o modo SQL `TIME_TRUNCATE_FRACTIONAL`:

  ```
  SET @@sql_mode = sys.list_add(@@sql_mode, 'TIME_TRUNCATE_FRACTIONAL');
  ```

  Com esse modo SQL habilitado, os valores temporais são inseridos com truncação:

  ```
  mysql> SELECT * FROM fractest;
  +-------------+------------------------+------------------------+
  | c1          | c2                     | c3                     |
  +-------------+------------------------+------------------------+
  | 17:51:04.77 | 2018-09-08 17:51:04.77 | 2018-09-08 17:51:04.77 |
  +-------------+------------------------+------------------------+
  ```

* Funções que aceitam argumentos temporais aceitam valores com segundos fracionários. Os valores retornados por funções temporais incluem segundos fracionários conforme apropriado. Por exemplo, `NOW()` sem argumento retorna a data e hora atuais sem parte fracionária, mas aceita um argumento opcional de 0 a 6 para especificar que o valor de retorno inclui uma parte de segundos fracionários de tantos dígitos.

* A sintaxe para literais temporais produz valores temporais: `DATE 'str'`, `TIME 'str'` e `TIMESTAMP 'str'`, e os equivalentes da sintaxe ODBC. O valor resultante inclui uma parte fracionária de segundos no final, se especificada. Anteriormente, a palavra-chave do tipo de tempo era ignorada e essas construções produziam o valor de string. Veja Standard SQL e literais de data e hora ODBC