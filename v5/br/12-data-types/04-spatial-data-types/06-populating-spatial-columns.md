### 11.4.6 Preenchendo Colunas Espaciais

Após criar colunas espaciais, você pode preenchê-las com dados espaciais.

Os valores devem ser armazenados no formato de geometria interno, mas você pode convertê-los para esse formato a partir do formato Well-Known Text (WKT) ou Well-Known Binary (WKB). Os exemplos a seguir demonstram como inserir valores de geometria em uma tabela convertendo valores WKT para o formato de geometria interno:

* Realize a conversão diretamente na instrução `INSERT`:

  ```sql
  INSERT INTO geom VALUES (ST_GeomFromText('POINT(1 1)'));

  SET @g = 'POINT(1 1)';
  INSERT INTO geom VALUES (ST_GeomFromText(@g));
  ```

* Realize a conversão antes do `INSERT`:

  ```sql
  SET @g = ST_GeomFromText('POINT(1 1)');
  INSERT INTO geom VALUES (@g);
  ```

Os exemplos a seguir inserem geometrias mais complexas na tabela:

```sql
SET @g = 'LINESTRING(0 0,1 1,2 2)';
INSERT INTO geom VALUES (ST_GeomFromText(@g));

SET @g = 'POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))';
INSERT INTO geom VALUES (ST_GeomFromText(@g));

SET @g =
'GEOMETRYCOLLECTION(POINT(1 1),LINESTRING(0 0,1 1,2 2,3 3,4 4))';
INSERT INTO geom VALUES (ST_GeomFromText(@g));
```

Os exemplos anteriores usam `ST_GeomFromText()` para criar valores de geometria. Você também pode usar funções específicas para o tipo:

```sql
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

Um programa de aplicação cliente que deseja usar representações WKB de valores de geometria é responsável por enviar WKB corretamente formatado em Queries para o servidor. Existem várias maneiras de satisfazer este requisito. Por exemplo:

* Inserindo um valor `POINT(1 1)` com sintaxe literal hexadecimal:

  ```sql
  INSERT INTO geom VALUES
  (ST_GeomFromWKB(X'0101000000000000000000F03F000000000000F03F'));
  ```

* Uma aplicação ODBC pode enviar uma representação WKB, vinculando-a a um placeholder usando um argumento do tipo `BLOB`:

  ```sql
  INSERT INTO geom VALUES (ST_GeomFromWKB(?))
  ```

  Outras interfaces de programação podem suportar um mecanismo de placeholder similar.

* Em um programa C, você pode escapar um valor binário usando `mysql_real_escape_string_quote()` e incluir o resultado em uma string de Query que é enviada ao servidor. Consulte mysql_real_escape_string_quote().