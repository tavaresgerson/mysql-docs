### 11.4.1 Tipos de dados espaciais

O MySQL possui tipos de dados espaciais que correspondem às classes OpenGIS. A base desses tipos é descrita na Seção 11.4.2, “O Modelo de Geometria OpenGIS”.

Alguns tipos de dados espaciais armazenam valores de geometria únicos:

- `GEOMETRIA`
- `PONTO`
- `LINESTRING`
- `POLÍGONO`

`GEOMETRY` pode armazenar valores de geometria de qualquer tipo. Os outros tipos de valor único (`POINT`, `LINESTRING` e `POLYGON`) restringem seus valores a um tipo de geometria específico.

Os outros tipos de dados espaciais contêm coleções de valores:

- `MULTIPOINT`
- `MULTILINESTRING`
- `MULTIPOLIGÔNIO`
- `GEOMETRYCOLLECTION`

`GEOMETRYCOLLECTION` pode armazenar uma coleção de objetos de qualquer tipo. Os outros tipos de coleção (`MULTIPOINT`, `MULTILINESTRING` e `MULTIPOLYGON`) restringem os membros da coleção a aqueles que possuem um tipo de geometria específico.

Exemplo: Para criar uma tabela chamada `geom` que tenha uma coluna chamada `g` que possa armazenar valores de qualquer tipo de geometria, use esta instrução:

```sql
CREATE TABLE geom (g GEOMETRY);
```

Os índices `SPATIAL` podem ser criados em colunas espaciais `NOT NULL`, então, se você planeja indexar a coluna, declare-a `NOT NULL`:

```sql
CREATE TABLE geom (g GEOMETRY NOT NULL);
```

Para outros exemplos que mostram como usar tipos de dados espaciais no MySQL, consulte a Seção 11.4.5, “Criando Colunas Espaciais”.
