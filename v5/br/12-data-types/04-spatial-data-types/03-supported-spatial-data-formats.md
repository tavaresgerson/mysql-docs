### 11.4.3 Formas de dados espaciais suportadas

Dois formatos de dados espaciais padrão são usados para representar objetos de geometria em consultas:

- Formato WKT (Well-Known Text)
- Formato Binário Conhecido (WKB)

Internamente, o MySQL armazena os valores de geometria em um formato que não é idêntico ao formato WKT ou WKB. (O formato interno é semelhante ao WKB, mas com 4 bytes iniciais para indicar o SRID.)

Existem funções disponíveis para converter entre diferentes formatos de dados; consulte a Seção 12.16.6, “Funções de conversão de formatos de geometria”.

As seções a seguir descrevem os formatos de dados espaciais que o MySQL utiliza:

- Formato de Texto Conhecido (WKT) ("Formato")
- Formato Binário Conhecido (WKB) ("Formato")
- Formato de Armazenamento de Geometria Interna

#### Formato de Texto Bem Conhecido (WKT)

A representação do texto bem conhecido (WKT) dos valores de geometria é projetada para a troca de dados de geometria em formato ASCII. A especificação OpenGIS fornece uma gramática Backus-Naur que especifica as regras de produção formal para a escrita de valores WKT (veja a Seção 11.4, “Tipos de Dados Espaciais”).

Exemplos de representações WKT de objetos geométricos:

- Um `Ponto`:

  ```sql
  POINT(15 20)
  ```

  As coordenadas do ponto são especificadas sem vírgula de separação. Isso difere da sintaxe da função SQL `Point()`, que requer uma vírgula entre as coordenadas. Tenha cuidado para usar a sintaxe apropriada para o contexto de uma operação espacial dada. Por exemplo, as seguintes declarações usam `ST_X()` para extrair a coordenada X de um objeto `Point`. A primeira produz o objeto diretamente usando a função `Point()`. A segunda usa uma representação WKT convertida em um `Point` com `ST_GeomFromText()`.

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

- Uma `LineString` com quatro pontos:

  ```sql
  LINESTRING(0 0, 10 10, 20 25, 50 60)
  ```

  Os pares de coordenadas de ponto são separados por vírgulas.

- Um `Poligono` com um anel externo e um anel interno:

  ```sql
  POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))
  ```

- Um `MultiPonto` com três valores `Ponto`:

  ```sql
  MULTIPOINT(0 0, 20 20, 60 60)
  ```

  A partir do MySQL 5.7.9, as funções espaciais, como `ST_MPointFromText()` e `ST_GeomFromText()`, que aceitam representações no formato WKT de valores `MultiPoint`, permitem que os pontos individuais dentro dos valores sejam envolvidos por parênteses. Por exemplo, ambas as chamadas de função a seguir são válidas, enquanto que antes do MySQL 5.7.9, a segunda produz um erro:

  ```sql
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

  A partir do MySQL 5.7.9, a saída para os valores `MultiPoint` inclui parênteses ao redor de cada ponto. Por exemplo:

  ```sql
  mysql> SET @mp = 'MULTIPOINT(1 1, 2 2, 3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```

  Antes do MySQL 5.7.9, a saída para o mesmo valor não inclui parênteses ao redor de cada ponto:

  ```sql
  mysql> SET @mp = 'MULTIPOINT(1 1, 2 2, 3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT(1 1,2 2,3 3)         |
  +---------------------------------+
  ```

- Uma `MultiLineString` com dois valores `LineString`:

  ```sql
  MULTILINESTRING((10 10, 20 20), (15 15, 30 15))
  ```

- Um `MultiPolygon` com dois valores `Polygon`:

  ```sql
  MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7, 5 5)))
  ```

- Uma `GeometryCollection` composta por dois valores `Point` e uma `LineString`:

  ```sql
  GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))
  ```

#### Formato Binário Conhecido (WKB)

A representação binária conhecida (WKB) de valores geométricos é usada para a troca de dados geométricos como fluxos binários representados por valores `BLOB` que contêm informações WKB geométricas. Esse formato é definido pela especificação OpenGIS (veja a Seção 11.4, “Tipos de Dados Espaciais”). Também é definido no padrão ISO *SQL/MM Parte 3: Espacial*.

O WKB utiliza inteiros sem sinal de 1 byte, inteiros sem sinal de 4 bytes e números de dupla precisão de 8 bytes (formato IEEE 754). Um byte é composto por oito bits.

Por exemplo, um valor WKB que corresponde a `POINT(1 -1)` consiste nesta sequência de 21 bytes, cada um representado por dois algarismos hexadecimais:

```sql
0101000000000000000000F03F000000000000F0BF
```

A sequência é composta pelos componentes mostrados na tabela a seguir.

**Tabela 11.2 Exemplo de Componentes WKB**

<table summary="Exemplo mostrando o componente nos valores WKB."><col style="width: 30%"/><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th scope="col">Componente</th> <th scope="col">Tamanho</th> <th scope="col">Valor</th> </tr></thead><tbody><tr> <th scope="row">Ordem dos bytes</th> <td>1 byte</td> <td>[[<code>01</code>]]</td> </tr><tr> <th scope="row">Tipo WKB</th> <td>4 bytes</td> <td>[[<code>01000000</code>]]</td> </tr><tr> <th scope="row">Coordenada X</th> <td>8 bytes</td> <td>[[<code>000000000000F03F</code>]]</td> </tr><tr> <th scope="row">Coordenada Y</th> <td>8 bytes</td> <td>[[<code>000000000000F0BF</code>]]</td> </tr></tbody></table>

A representação dos componentes é a seguinte:

- O indicador de ordem de byte é 1 ou 0 para indicar o armazenamento em ordem de byte little-endian ou big-endian. As ordens de byte little-endian e big-endian também são conhecidas como Representação de Dados de Rede (NDR) e Representação de Dados Externos (XDR), respectivamente.

- O tipo WKB é um código que indica o tipo de geometria. O MySQL usa valores de 1 a 7 para indicar `Ponto`, `LinhaString`, `Poligono`, `MultiPonto`, `MultiLinhaString`, `MultiPoligono` e `Coleção de Geometria`.

- Um valor de `Ponto` tem coordenadas X e Y, cada uma representada como um valor de ponto dupla.

Os valores WKB para valores de geometria mais complexos têm estruturas de dados mais complexas, conforme detalhado na especificação OpenGIS.

#### Formato de Armazenamento de Geometria Interna

O MySQL armazena valores de geometria usando 4 bytes para indicar o SRID seguido da representação WKB do valor. Para uma descrição do formato WKB, consulte "Formato de Formato Binário Bem Conhecido (WKB)".

Para a parte WKB, essas considerações específicas do MySQL se aplicam:

- O byte de indicador de ordem de bytes é 1 porque o MySQL armazena as geometrias como valores little-endian.

- O MySQL suporta tipos de geometria `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon` e `GeometryCollection`. Outros tipos de geometria não são suportados.

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

O comprimento do valor é de 25 bytes, composto por esses componentes (como pode ser visto pelo valor hexadecimal):

- 4 bytes para o SRID inteiro (0)

- 1 byte para a ordem de bytes inteira (1 = little-endian)

- 4 bytes para informações do tipo inteiro (1 = `Ponto`)

- 8 bytes para a coordenada X de dupla precisão (1)

- 8 bytes para a coordenada Y de dupla precisão (−1)
