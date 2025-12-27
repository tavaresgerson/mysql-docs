### 13.4.7 Populando Colunas Espaciais

Depois de criar colunas espaciais, você pode preencher elas com dados espaciais.

Os valores devem ser armazenados no formato de geometria interna, mas você pode convertê-los para esse formato a partir do formato de Texto Conhecido (WKT) ou Binário Conhecido (WKB). Os exemplos seguintes demonstram como inserir valores de geometria em uma tabela convertendo valores WKT para o formato de geometria interna:

* Realize a conversão diretamente na instrução `INSERT`:

  ```
  INSERT INTO geom VALUES (ST_GeomFromText('POINT(1 1)'));

  SET @g = 'POINT(1 1)';
  INSERT INTO geom VALUES (ST_GeomFromText(@g));
  ```
* Realize a conversão antes da `INSERT`:

  ```
  SET @g = ST_GeomFromText('POINT(1 1)');
  INSERT INTO geom VALUES (@g);
  ```

Os exemplos seguintes inserem geometrias mais complexas na tabela:

```
SET @g = 'LINESTRING(0 0,1 1,2 2)';
INSERT INTO geom VALUES (ST_GeomFromText(@g));

SET @g = 'POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))';
INSERT INTO geom VALUES (ST_GeomFromText(@g));

SET @g =
'GEOMETRYCOLLECTION(POINT(1 1),LINESTRING(0 0,1 1,2 2,3 3,4 4))';
INSERT INTO geom VALUES (ST_GeomFromText(@g));
```

Os exemplos anteriores usam `ST_GeomFromText()` para criar valores de geometria. Você também pode usar funções específicas do tipo:

```
SET @g = 'POINT(1 1)';
INSERT INTO geom VALUES (ST_PointFromText(@g));

SET @g = 'LINESTRING(0 0,1 1,2 2)';
INSERT INTO geom VALUES (ST_LineStringFromText(@g));

SET @g = 'POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))';
INSERT INTO geom VALUES (ST_PolygonFromText(@g));

SET @g =
'GEOMETRYCOLLECTION(POINT(1 1),LINESTRING(0 0,1 1,2 2,3 3,4 4))';
INSERT INTO geom VALUES (ST_GeomCollFromText(@g));
```

Um programa de aplicativo cliente que deseja usar representações WKB de valores de geometria é responsável por enviar WKB corretamente formado em consultas ao servidor. Existem várias maneiras de atender a essa exigência. Por exemplo:

* Inserir um valor `POINT(1 1)` com sintaxe literal hexadecimal:

  ```
  INSERT INTO geom VALUES
  (ST_GeomFromWKB(X'0101000000000000000000F03F000000000000F03F'));
  ```
* Um aplicativo ODBC pode enviar uma representação WKB, vinculando-a a um localizador usando um argumento do tipo `BLOB`:

  ```
  INSERT INTO geom VALUES (ST_GeomFromWKB(?))
  ```

Outras interfaces de programação podem suportar um mecanismo de localizador semelhante.
* Em um programa em C, você pode escapar um valor binário usando `mysql_real_escape_string_quote()` e incluir o resultado em uma string de consulta que é enviada ao servidor. Veja mysql\_real\_escape\_string\_quote().