### 13.4.1 Tipos de dados espaciais

O MySQL possui tipos de dados espaciais que correspondem às classes OpenGIS. A base desses tipos é descrita na Seção 13.4.2, “O Modelo de Geometria OpenGIS”.

Alguns tipos de dados espaciais armazenam valores de geometria únicos:

- `GEOMETRY`
- `POINT`
- `LINESTRING`
- `POLYGON`

`GEOMETRY` pode armazenar valores de geometria de qualquer tipo. Os outros tipos de valor único (`POINT`, `LINESTRING` e `POLYGON`) restringem seus valores a um tipo de geometria específico.

Os outros tipos de dados espaciais contêm coleções de valores:

- `MULTIPOINT`
- `MULTILINESTRING`
- `MULTIPOLYGON`
- `GEOMETRYCOLLECTION`

`GEOMETRYCOLLECTION` pode armazenar uma coleção de objetos de qualquer tipo. Os outros tipos de coleção (`MULTIPOINT`, `MULTILINESTRING` e `MULTIPOLYGON`) restringem os membros da coleção a aqueles que possuem um tipo de geometria específico.

Exemplo: Para criar uma tabela chamada `geom` que tenha uma coluna chamada `g` que pode armazenar valores de qualquer tipo de geometria, use esta declaração:

```
CREATE TABLE geom (g GEOMETRY);
```

Colunas com um tipo de dado espacial podem ter um atributo `SRID`, para indicar explicitamente o sistema de referência espacial (SRS) para os valores armazenados na coluna. Por exemplo:

```
CREATE TABLE geom (
    p POINT SRID 0,
    g GEOMETRY NOT NULL SRID 4326
);
```

Os índices `SPATIAL` podem ser criados em colunas espaciais se forem `NOT NULL` e tiverem um SRID específico, portanto, se você planeja indexar a coluna, declare-a com os atributos `NOT NULL` e `SRID`:

```
CREATE TABLE geom (g GEOMETRY NOT NULL SRID 4326);
```

As tabelas `InnoDB` permitem valores `SRID` para SRSs cartesianas e geográficas. As tabelas `MyISAM` permitem valores `SRID` para SRSs cartesianas.

O atributo `SRID` torna uma coluna espacial com restrição de SRID, o que tem essas implicações:

- A coluna pode conter apenas valores com o SRID especificado. Tentativas de inserir valores com um SRID diferente geram um erro.

- O otimizador pode usar índices `SPATIAL` na coluna. Veja a Seção 10.3.3, “Otimização de Índices Espaciais”.

Colunas espaciais sem o atributo `SRID` não são restritas ao SRID e aceitam valores com qualquer SRID. No entanto, o otimizador não pode usar índices `SPATIAL` nelas até que a definição da coluna seja modificada para incluir um atributo `SRID`, o que pode exigir que o conteúdo da coluna seja modificado primeiro para que todos os valores tenham o mesmo SRID.

Para outros exemplos que mostram como usar tipos de dados espaciais no MySQL, consulte a Seção 13.4.6, “Criando Colunas Espaciais”. Para informações sobre sistemas de referência espacial, consulte a Seção 13.4.5, “Suporte a Sistemas de Referência Espacial”.
