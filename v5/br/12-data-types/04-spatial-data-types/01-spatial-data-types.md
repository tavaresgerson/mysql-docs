### 11.4.1 Tipos de Dados Espaciais

O MySQL possui tipos de dados espaciais que correspondem às classes OpenGIS. A base para esses tipos é descrita na Seção 11.4.2, “O Modelo de Geometry OpenGIS”.

Alguns tipos de dados espaciais armazenam valores de geometry únicos:

* `GEOMETRY`
* `POINT`
* `LINESTRING`
* `POLYGON`

`GEOMETRY` pode armazenar valores de geometry de qualquer tipo. Os outros tipos de valor único (`POINT`, `LINESTRING` e `POLYGON`) restringem seus valores a um tipo de geometry específico.

Os outros tipos de dados espaciais armazenam coleções de valores:

* `MULTIPOINT`
* `MULTILINESTRING`
* `MULTIPOLYGON`
* `GEOMETRYCOLLECTION`

`GEOMETRYCOLLECTION` pode armazenar uma coleção de objetos de qualquer tipo. Os outros tipos de coleção (`MULTIPOINT`, `MULTILINESTRING` e `MULTIPOLYGON`) restringem os membros da coleção àqueles que possuem um tipo de geometry específico.

Exemplo: Para criar uma table chamada `geom` que tenha uma coluna chamada `g` que possa armazenar valores de qualquer tipo de geometry, utilize esta instrução:

```sql
CREATE TABLE geom (g GEOMETRY);
```

Indexes `SPATIAL` podem ser criados em colunas espaciais `NOT NULL`, portanto, se você planeja criar um Index na coluna, declare-a como `NOT NULL`:

```sql
CREATE TABLE geom (g GEOMETRY NOT NULL);
```

Para outros exemplos mostrando como usar tipos de dados espaciais no MySQL, consulte a Seção 11.4.5, “Criação de Colunas Espaciais”.