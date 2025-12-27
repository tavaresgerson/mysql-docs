### 13.4.3 Formandos de Dados Espaciais Compatíveis

Dois formatos de dados espaciais padrão são usados para representar objetos de geometria em consultas:

* Formato de Texto Conhecido (WKT)
* Formato Binário Conhecido (WKB)

Internamente, o MySQL armazena os valores de geometria em um formato que não é idêntico ao formato WKT ou WKB. (O formato interno é semelhante ao WKB, mas com 4 bytes iniciais para indicar o SRID.)

Existem funções disponíveis para converter entre diferentes formatos de dados; consulte  Seção 14.16.6, “Funções de Conversão de Formatos de Geometria”.

As seções a seguir descrevem os formatos de dados espaciais que o MySQL usa:

* Formato de Texto Conhecido (WKT)
* Formato Binário Conhecido (WKB)
* Formato de Armazenamento de Geometria Interna

#### Formato de Texto Conhecido (WKT)

A representação de valores de geometria no Formato de Texto Conhecido (WKT) é projetada para a troca de dados de geometria em formato ASCII. A especificação OpenGIS fornece uma gramática Backus-Naur que especifica as regras de produção formal para a escrita de valores WKT (consulte  Seção 13.4, “Tipos de Dados Espaciais”).

Exemplos de representações WKT de objetos de geometria:

* Um `Ponto`:

  ```
  POINT(15 20)
  ```

  As coordenadas do ponto são especificadas sem vírgula separadora. Isso difere da sintaxe para a função `Ponto()` do SQL, que requer uma vírgula entre as coordenadas. Tenha cuidado para usar a sintaxe apropriada para o contexto de uma operação espacial dada. Por exemplo, as seguintes declarações usam ambas `ST_X()` para extrair a coordenada X de um objeto `Ponto`. A primeira produz o objeto diretamente usando a função `Ponto()`. A segunda usa uma representação WKT convertida em um `Ponto` com `ST_GeomFromText()`.

  ```
  mysql> SELECT ST_X(Point(15, 20));
  +---------------------+
  | ST_X(POINT(15, 20)) |
  +---------------------+
  |                  15 |
  +---------------------+

  mysql> SELECT ST_X(ST_GeomFromText('POINT(15 20)'));
  +---------------------------------------+
  | ST_X(ST_GeomFromText('POINT(15 20)')) |
  +---------------------------------------+
  |                                    15 |
  +---------------------------------------+
  ```
* Uma `Linha de Pontos` com quatro pontos:

  ```
  LINESTRING(0 0, 10 10, 20 25, 50 60)
  ```

  Os pares de coordenadas de ponto são separados por vírgulas.
* Um `Poligono` com um anel externo e um anel interno:

  ```
  POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))
  ```
* Um `MultiPonto` com três valores de `Ponto`:

  ```
  MULTIPOINT(0 0, 20 20, 60 60)
  ```

Funções espaciais como `ST_MPointFromText()` e `ST_GeomFromText()` que aceitam representações no formato WKT de valores `MultiPoint` permitem que pontos individuais dentro dos valores sejam envolvidos por parênteses. Por exemplo, ambas as chamadas de função a seguir são válidas:

```
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```wNPQFWftIE
* Uma `MultiPolygon` com dois valores `Polygon`:

  ```
  MULTILINESTRING((10 10, 20 20), (15 15, 30 15))
  ```QsTWfylAkc
#### Formato Binário Conhecido (WKB)

A representação Binário Conhecido (WKB) de valores geométricos é usada para a troca de dados geométricos como fluxos binários representados por valores `BLOB` que contêm informações WKB geométricas. Este formato é definido pela especificação OpenGIS (ver Seção 13.4, “Tipos de Dados Espaciais”). Também é definido no padrão ISO *SQL/MM Parte 3: Espacial*.

O WKB usa inteiros unsigned de 1 byte, inteiros unsigned de 4 bytes e números de ponto dupla de 8 bytes (formato IEEE 754). Um byte é oito bits.

Por exemplo, um valor WKB que corresponde a `POINT(1 -1)` consiste nesta sequência de 21 bytes, cada um representado por dois dígitos hexadecimais:

```
  MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7, 5 5)))
  ```cU60zOu7VE```

O comprimento do valor é de 25 bytes, composto por esses componentes (como pode ser visto pelo valor hexadecimal):

* 4 bytes para o SRID inteiro (0)
* 1 byte para a ordem de bytes inteiro (1 = little-endian)
* 4 bytes para a informação de tipo inteiro (1 = `Point`)
* 8 bytes para a coordenada X de dupla precisão (1)
* 8 bytes para a coordenada Y de dupla precisão (−1)