### 11.4.3 Formatos de Dados Espaciais Suportados

Dois formatos padrão de dados espaciais são usados para representar objetos geometry em Querys:

* Formato Well-Known Text (WKT)
* Formato Well-Known Binary (WKB)

Internamente, o MySQL armazena valores geometry em um formato que não é idêntico nem ao formato WKT nem ao formato WKB. (O formato interno é semelhante ao WKB, mas com 4 bytes iniciais para indicar o SRID.)

Existem funções disponíveis para converter entre diferentes formatos de dados; consulte a Seção 12.16.6, “Geometry Format Conversion Functions”.

As seções a seguir descrevem os formatos de dados espaciais que o MySQL utiliza:

* Formato Well-Known Text (WKT)
* Formato Well-Known Binary (WKB)
* Formato Interno de Armazenamento Geometry

#### Formato Well-Known Text (WKT)

A representação Well-Known Text (WKT) de valores geometry é projetada para a troca de dados geometry em formato ASCII. A especificação OpenGIS fornece uma gramática Backus-Naur que especifica as regras formais de produção para escrever valores WKT (consulte a Seção 11.4, “Spatial Data Types”).

Exemplos de representações WKT de objetos geometry:

* Um `Point`:

  ```sql
  POINT(15 20)
  ```

  As coordenadas do Point são especificadas sem vírgula de separação. Isso difere da sintaxe para a função SQL `Point()`, que requer uma vírgula entre as coordenadas. Tenha cuidado para usar a sintaxe apropriada ao contexto de uma determinada operação espacial. Por exemplo, as seguintes instruções ambas usam `ST_X()` para extrair a coordenada X de um objeto `Point`. A primeira produz o objeto diretamente usando a função `Point()`. A segunda usa uma representação WKT convertida em um `Point` com `ST_GeomFromText()`.

  ```sql
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

* Uma `LineString` com quatro points:

  ```sql
  LINESTRING(0 0, 10 10, 20 25, 50 60)
  ```

  Os pares de coordenadas dos points são separados por vírgulas.

* Um `Polygon` com um anel exterior e um anel interior:

  ```sql
  POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))
  ```

* Um `MultiPoint` com três valores `Point`:

  ```sql
  MULTIPOINT(0 0, 20 20, 60 60)
  ```

  A partir do MySQL 5.7.9, funções espaciais como `ST_MPointFromText()` e `ST_GeomFromText()` que aceitam representações de valores `MultiPoint` no formato WKT permitem que os points individuais dentro dos valores sejam cercados por parênteses. Por exemplo, ambas as seguintes chamadas de função são válidas, enquanto antes do MySQL 5.7.9 a segunda gerava um erro:

  ```sql
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

  A partir do MySQL 5.7.9, a saída para valores `MultiPoint` inclui parênteses em torno de cada point. Por exemplo:

  ```sql
  mysql> SET @mp = 'MULTIPOINT(1 1, 2 2, 3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```

  Antes do MySQL 5.7.9, a saída para o mesmo valor não incluía parênteses em torno de cada point:

  ```sql
  mysql> SET @mp = 'MULTIPOINT(1 1, 2 2, 3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT(1 1,2 2,3 3)         |
  +---------------------------------+
  ```

* Uma `MultiLineString` com dois valores `LineString`:

  ```sql
  MULTILINESTRING((10 10, 20 20), (15 15, 30 15))
  ```

* Um `MultiPolygon` com dois valores `Polygon`:

  ```sql
  MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7, 5 5)))
  ```

* Uma `GeometryCollection` consistindo de dois valores `Point` e uma `LineString`:

  ```sql
  GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))
  ```

#### Formato Well-Known Binary (WKB)

A representação Well-Known Binary (WKB) de valores geométricos é usada para a troca de dados geometry como streams binários representados por valores `BLOB` contendo informações WKB geométricas. Este formato é definido pela especificação OpenGIS (consulte a Seção 11.4, “Spatial Data Types”). Ele também é definido no padrão ISO *SQL/MM Part 3: Spatial*.

WKB usa inteiros sem sinal de 1 byte, inteiros sem sinal de 4 bytes e números de precisão dupla de 8 bytes (formato IEEE 754). Um byte tem oito bits.

Por exemplo, um valor WKB que corresponde a `POINT(1 -1)` consiste nesta sequência de 21 bytes, cada um representado por dois dígitos hexadecimais:

```sql
0101000000000000000000F03F000000000000F0BF
```

A sequência consiste nos componentes mostrados na tabela a seguir.

**Tabela 11.2 Exemplo de Componentes WKB**

| Componente | Tamanho | Valor |
| :--- | :--- | :--- |
| Ordem de bytes | 1 byte | `01` |
| Tipo WKB | 4 bytes | `01000000` |
| Coordenada X | 8 bytes | `000000000000F03F` |
| Coordenada Y | 8 bytes | `000000000000F0BF` |

A representação do componente é a seguinte:

* O indicador de ordem de bytes é 1 ou 0 para significar armazenamento little-endian ou big-endian. As ordens de bytes little-endian e big-endian também são conhecidas como Network Data Representation (NDR) e External Data Representation (XDR), respectivamente.

* O tipo WKB é um código que indica o tipo geometry. O MySQL usa valores de 1 a 7 para indicar `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon` e `GeometryCollection`.

* Um valor `Point` possui coordenadas X e Y, cada uma representada como um valor de precisão dupla.

Valores WKB para valores geometry mais complexos possuem estruturas de dados mais complexas, conforme detalhado na especificação OpenGIS.

#### Formato Interno de Armazenamento Geometry

O MySQL armazena valores geometry usando 4 bytes para indicar o SRID, seguidos pela representação WKB do valor. Para uma descrição do formato WKB, consulte Formato Well-Known Binary (WKB)).

Para a parte WKB, estas considerações específicas do MySQL se aplicam:

* O byte indicador de ordem de bytes é 1 porque o MySQL armazena geometrias como valores little-endian.

* O MySQL suporta os tipos geometry `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon` e `GeometryCollection`. Outros tipos geometry não são suportados.

A função `LENGTH()` retorna o espaço em bytes necessário para o armazenamento do valor. Exemplo:

```sql
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

O comprimento do valor é de 25 bytes, composto por estes componentes (como pode ser visto a partir do valor hexadecimal):

* 4 bytes para o SRID inteiro (0)
* 1 byte para a ordem de bytes inteira (1 = little-endian)
* 4 bytes para a informação de tipo inteira (1 = `Point`)
* 8 bytes para a coordenada X de precisão dupla (1)
* 8 bytes para a coordenada Y de precisão dupla (−1)
