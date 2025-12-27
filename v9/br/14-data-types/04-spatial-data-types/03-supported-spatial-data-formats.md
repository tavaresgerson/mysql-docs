### 13.4.3 Formatos de Dados Espaciais Compatíveis

Dois formatos padrão de dados espaciais são usados para representar objetos de geometria em consultas:

* Formato de Texto Conhecido (WKT)
* Formato Binário Conhecido (WKB)

Internamente, o MySQL armazena os valores de geometria em um formato que não é idêntico ao formato WKT ou WKB. (O formato interno é semelhante ao WKB, mas com 4 bytes iniciais para indicar o SRID.)

Existem funções disponíveis para converter entre diferentes formatos de dados; consulte a Seção 14.16.6, “Funções de Conversão de Formatos de Geometria”.

As seções a seguir descrevem os formatos de dados espaciais que o MySQL usa:

* Formato de Texto Conhecido (WKT)
* Formato Binário Conhecido (WKB)
* Formato de Armazenamento de Geometria Interna

#### Formato de Texto Conhecido (WKT)

A representação de valores de geometria no formato de Texto Conhecido (WKT) é projetada para a troca de dados de geometria em formato ASCII. A especificação OpenGIS fornece uma gramática Backus-Naur que especifica as regras de produção formal para a escrita de valores WKT (consulte a Seção 13.4, “Tipos de Dados Espaciais”).

Exemplos de representações WKT de objetos de geometria:

* Um `Ponto`:

  ```
  POINT(15 20)
  ```

  As coordenadas do ponto são especificadas sem vírgula separadora. Isso difere da sintaxe para a função `Point()` do SQL, que requer uma vírgula entre as coordenadas. Tenha cuidado para usar a sintaxe apropriada para o contexto de uma operação espacial dada. Por exemplo, as seguintes declarações usam ambas `ST_X()` para extrair a coordenada X de um objeto `Point`. A primeira produz o objeto diretamente usando a função `Point()`. A segunda usa uma representação WKT convertida em um `Point` com `ST_GeomFromText()`.

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

* Uma `LineString` com quatro pontos:

  ```
  LINESTRING(0 0, 10 10, 20 25, 50 60)
  ```

  Os pares de coordenadas de ponto são separados por vírgulas.

* Um `Polygon` com um anel externo e um anel interno:

  ```
  POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))
  ```

* Um `MultiPoint` com três valores `Point`:

  ```
  MULTIPOINT(0 0, 20 20, 60 60)
  ```

Funções espaciais como `ST_MPointFromText()` e `ST_GeomFromText()` que aceitam representações no formato WKT de valores `MultiPoint` permitem que os pontos individuais dentro dos valores sejam envolvidos por parênteses. Por exemplo, ambos os seguintes chamados de função são válidos:

```
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

* Um `MultiLineString` com dois valores `LineString`:

  ```
  MULTILINESTRING((10 10, 20 20), (15 15, 30 15))
  ```

* Um `MultiPolygon` com dois valores `Polygon`:

  ```
  MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7, 5 5)))
  ```

* Um `GeometryCollection` composto por dois valores `Point` e um `LineString`:

  ```
  GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))
  ```

#### Formato Binário Conhecido (WKB)

A representação binária conhecida (WKB) de valores geométricos é usada para a troca de dados geométricos como fluxos binários representados por valores `BLOB` que contêm informações WKB geométricas. Este formato é definido pela especificação OpenGIS (ver Seção 13.4, “Tipos de Dados Espaciais”). Também é definido no padrão ISO *SQL/MM Parte 3: Espacial*.

O WKB usa inteiros sem sinal de 1 byte, inteiros sem sinal de 4 bytes e números de dupla precisão de 8 bytes (formato IEEE 754). Um byte é oito bits.

Por exemplo, um valor WKB que corresponde a `POINT(1 -1)` consiste nesta sequência de 21 bytes, cada um representado por dois dígitos hexadecimais:

```
0101000000000000000000F03F000000000000F0BF
```

A sequência consiste nos componentes mostrados na tabela a seguir.

**Tabela 13.2 Exemplo de Componentes WKB**

A representação dos componentes é a seguinte:

* O indicador de ordem de bytes é 1 ou 0 para indicar o armazenamento em ordem de bytes little-endian ou big-endian. As ordens de bytes little-endian e big-endian também são conhecidas como Representação de Dados de Rede (NDR) e Representação de Dados Externo (XDR), respectivamente.

* O tipo WKB é um código que indica o tipo de geometria. O MySQL usa valores de 1 a 7 para indicar `Ponto`, `Linha de String`, `Poligono`, `Ponto Múltiplo`, `Linha de String Múltipla`, `Poligono Múltipla` e `Coleção de Geometria`.

* Um valor de `Ponto` tem coordenadas X e Y, cada uma representada como um valor de ponto-flutuante de precisão dupla.

Os valores WKB para valores de geometria mais complexos têm estruturas de dados mais complexas, conforme detalhado na especificação OpenGIS.

#### Formato de Armazenamento de Geometria Interna

O MySQL armazena valores de geometria usando 4 bytes para indicar o SRID seguido da representação WKB do valor. Para uma descrição do formato WKB, consulte o formato Well-Known Binary (WKB)").

Para a parte WKB, essas considerações específicas do MySQL se aplicam:

* O byte indicador de ordem de bytes é 1 porque o MySQL armazena as geometrias como valores little-endian.

* O MySQL suporta tipos de geometria de `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon` e `GeometryCollection`. Outros tipos de geometria não são suportados.

* Apenas o `GeometryCollection` pode ser vazio. Esse valor é armazenado com 0 elementos.

* Os anéis de polígonos podem ser especificados tanto no sentido horário quanto no sentido anti-horário. O MySQL inverte os anéis automaticamente ao ler os dados.

As coordenadas cartesianas são armazenadas na unidade de comprimento do sistema de referência espacial, com valores X nas coordenadas X e valores Y nas coordenadas Y. As direções dos eixos são as especificadas pelo sistema de referência espacial.

As coordenadas geográficas são armazenadas na unidade de ângulo do sistema de referência espacial, com longitudes nas coordenadas X e latitudes nas coordenadas Y. As direções dos eixos e o meridiano são as especificadas pelo sistema de referência espacial.

A função `LENGTH()` retorna o espaço em bytes necessário para o armazenamento do valor. Exemplo:

```
mysql> SET @g = ST_GeomFromText('POINT(1 -1)');
mysql> SELECT LENGTH(@g);
+------------+
| LENGTH(@g) |
+------------+
|         25 |
+------------+
mysql> SELECT HEX(@g);
+----------------------------------------------------+
| HEX(@g)                                            |
+----------------------------------------------------+
| 000000000101000000000000000000F03F000000000000F0BF |
+----------------------------------------------------+
```

O comprimento do valor é de 25 bytes, composto por esses componentes (como pode ser visto pelo valor hexadecimal):

* 4 bytes para o SRID inteiro (0)
* 1 byte para a ordem de bytes inteiro (1 = little-endian)
* 4 bytes para a informação de tipo inteiro (1 = `Point`)

* 8 bytes para a coordenada X de precisão dupla (1)
* 8 bytes para a coordenada Y de precisão dupla (−1)