### 11.2.7 Segundos Fracionários em Valores de Tempo

O MySQL suporta segundos fracionários para valores `TIME`, `DATETIME` e `TIMESTAMP`, com precisão de até microssegundos (6 dígitos):

* Para definir uma coluna que inclui uma parte de segundos fracionários, use a sintaxe `type_name(fsp)`, onde *`type_name`* é `TIME`, `DATETIME` ou `TIMESTAMP`, e *`fsp`* é a precisão dos segundos fracionários. Por exemplo:

  ```sql
  CREATE TABLE t1 (t TIME(3), dt DATETIME(6));
  ```

  O valor *`fsp`*, se fornecido, deve estar no intervalo de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão SQL de 6, por questões de compatibilidade com versões anteriores do MySQL.)

* Inserir um valor `TIME`, `DATE` ou `TIMESTAMP` com uma parte de segundos fracionários em uma coluna do mesmo tipo, mas com menos dígitos fracionários, resulta em arredondamento. Considere uma tabela criada e populada da seguinte forma:

  ```sql
  CREATE TABLE fractest( c1 TIME(2), c2 DATETIME(2), c3 TIMESTAMP(2) );
  INSERT INTO fractest VALUES
  ('17:51:04.777', '2018-09-08 17:51:04.777', '2018-09-08 17:51:04.777');
  ```

  Os valores temporais são inseridos na tabela com arredondamento:

  ```sql
  mysql> SELECT * FROM fractest;
  +-------------+------------------------+------------------------+
  | c1          | c2                     | c3                     |
  +-------------+------------------------+------------------------+
  | 17:51:04.78 | 2018-09-08 17:51:04.78 | 2018-09-08 17:51:04.78 |
  +-------------+------------------------+------------------------+
  ```

  Nenhum aviso ou erro é emitido quando tal arredondamento ocorre. Este comportamento segue o padrão SQL e não é afetado pela configuração `sql_mode` do server.

* Funções que aceitam argumentos temporais aceitam valores com segundos fracionários. Os valores de retorno das funções temporais incluem segundos fracionários conforme apropriado. Por exemplo, `NOW()` sem argumento retorna a data e hora atuais sem parte fracionária, mas aceita um argumento opcional de 0 a 6 para especificar que o valor de retorno deve incluir uma parte de segundos fracionários com esse número de dígitos.

* A sintaxe para literais temporais produz valores temporais: `DATE 'str'`, `TIME 'str'` e `TIMESTAMP 'str'`, e seus equivalentes na sintaxe ODBC. O valor resultante inclui uma parte de segundos fracionários final, se especificado. Anteriormente, a palavra-chave do tipo temporal era ignorada e essas construções produziam o valor string. Consulte Literais de Data e Hora Padrão SQL e ODBC