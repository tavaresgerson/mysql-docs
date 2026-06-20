## 11.4 Tipos de dados espaciais

O [Open Geospatial Consortium][(http://www.opengeospatial.org)] (OGC) é um consórcio internacional de mais de 250 empresas, agências e universidades que participam do desenvolvimento de soluções conceituais disponíveis publicamente que podem ser úteis para todos os tipos de aplicações que gerenciam dados espaciais.

O Consórcio de Geoprocessamento Aberto publica o *Padrão de Implementação OpenGIS® para Informações Geográficas - Acesso a Características Simples - Parte 2: Opção SQL*, um documento que propõe várias maneiras conceituais para estender um RDBMS SQL para suportar dados espaciais. Esta especificação está disponível no site do OGC em <http://www.opengeospatial.org/standards/sfs>.

De acordo com a especificação OGC, o MySQL implementa extensões espaciais como um subconjunto do ambiente **SQL com Tipos de Geometria**. Este termo se refere a um ambiente SQL que foi estendido com um conjunto de tipos de geometria. Uma coluna SQL com valor de geometria é implementada como uma coluna que tem um tipo de geometria. A especificação descreve um conjunto de tipos de geometria SQL, bem como funções sobre esses tipos para criar e analisar valores de geometria.

As extensões espaciais do MySQL permitem a geração, armazenamento e análise de características geográficas:

* Tipos de dados para representar valores espaciais
* Funções para manipular valores espaciais
* Indexação espacial para tempos de acesso melhorados a colunas espaciais

Os tipos de dados espaciais e as funções estão disponíveis para as tabelas `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE`. Para indexar colunas espaciais, os índices `MyISAM` e `InnoDB` suportam tanto os índices `SPATIAL` quanto os índices não `SPATIAL`. Os outros motores de armazenamento suportam índices não `SPATIAL`, conforme descrito na Seção 13.1.14, “Declaração CREATE INDEX”.

Uma **característica geográfica** é qualquer coisa no mundo que tenha uma localização. Uma característica pode ser:

* Uma entidade. Por exemplo, uma montanha, um pool, uma cidade. * Um espaço. Por exemplo, um distrito da cidade, os trópicos. * Uma localização definível. Por exemplo, uma encruzilhada, como um lugar específico onde duas ruas se cruzam.

Alguns documentos usam o termo **característica geospatial** para se referir a características geográficas.

**Geometria** é outra palavra que denota uma característica geográfica. Originalmente, a palavra **geometria** significava medição da terra. Outro significado vem da cartografia, referindo-se às características geométricas que os cartógrafos usam para mapear o mundo.

A discussão aqui considera esses termos sinônimos: **característica geográfica**, **característica geoespacial**, **característica** ou **geometria**. O termo mais comumente usado é **geometria**, definido como *um ponto ou um agregado de pontos representando qualquer coisa no mundo que tenha uma localização*.

O material a seguir abrange esses tópicos:

* Os tipos de dados espaciais implementados no modelo MySQL
* A base das extensões espaciais no modelo de geometria OpenGIS

* Formatos de dados para representar dados espaciais
* Como usar dados espaciais no MySQL
* Uso de indexação para dados espaciais
* Diferenças do MySQL em relação à especificação OpenGIS

Para informações sobre funções que operam em dados espaciais, consulte a Seção 12.16, “Funções de Análise Espacial”.

### Conformação e compatibilidade de SIG do MySQL

MySQL não implementa as seguintes funcionalidades de SIG:

* Visualizações de metadados adicionais

As especificações OpenGIS propõem várias visualizações de metadados adicionais. Por exemplo, uma visualização de sistema chamada `GEOMETRY_COLUMNS` contém uma descrição das colunas de geometria, uma string para cada coluna de geometria no banco de dados.

* A função OpenGIS `Length()` em `LineString` e `MultiLineString` deve ser chamada no MySQL como `ST_Length()`

O problema é que existe uma função SQL existente `Length()` que calcula o comprimento dos valores de cadeia, e às vezes não é possível distinguir se a função é chamada em um contexto textual ou espacial.

### Recursos adicionais

O Consórcio de Geoprocessamento Aberto publica o *Padrão de Implementação OpenGIS® para Informações Geográficas - Acesso Simples a Recursos - Parte 2: Opção SQL*, um documento que propõe várias maneiras conceituais para estender um RDBMS SQL para suportar dados espaciais. O Consórcio de Geoprocessamento Aberto (OGC) mantém um site em <http://www.opengeospatial.org/>. A especificação está disponível lá em <http://www.opengeospatial.org/standards/sfs>. Ela contém informações adicionais relevantes para o material aqui.

Se você tiver dúvidas ou preocupações sobre o uso das extensões espaciais para MySQL, pode discuti-las no fórum de SIG: <https://forums.mysql.com/list.php?23>.

### 11.4.1 Tipos de dados espaciais

O MySQL possui tipos de dados espaciais que correspondem às classes OpenGIS. A base para esses tipos é descrita na Seção 11.4.2, “O Modelo de Geometria OpenGIS”.

Alguns tipos de dados espaciais retêm valores de geometria únicos:

* `GEOMETRY`
* `POINT`
* `LINESTRING`
* `POLYGON`

`GEOMETRY` pode armazenar valores de geometria de qualquer tipo. Os outros tipos de valor único (`POINT`, `LINESTRING` e `POLYGON`) restringem seus valores a um tipo de geometria específico.

Os outros tipos de dados espaciais contêm coleções de valores:

* `MULTIPOINT`
* `MULTILINESTRING`
* `MULTIPOLYGON`
* `GEOMETRYCOLLECTION`

`GEOMETRYCOLLECTION` pode armazenar uma coleção de objetos de qualquer tipo. Os outros tipos de coleção (`MULTIPOINT`, `MULTILINESTRING` e `MULTIPOLYGON`) restringem os membros da coleção aos que possuem um tipo de geometria particular.

Exemplo: Para criar uma tabela denominada `geom` que tenha uma coluna denominada `g` que pode armazenar valores de qualquer tipo de geometria, use esta declaração:

```sql
CREATE TABLE geom (g GEOMETRY);
```

Os índices `SPATIAL` podem ser criados em colunas espaciais `NOT NULL`, portanto, se você planeja indexar a coluna, declare-a `NOT NULL`:

```sql
CREATE TABLE geom (g GEOMETRY NOT NULL);
```

Para outros exemplos que mostram como usar tipos de dados espaciais no MySQL, consulte a Seção 11.4.5, “Criando Colunas Espaciais”.

### 11.4.2 O Modelo de Geometria OpenGIS

O conjunto de tipos de geometria proposto pelo ambiente **SQL com Tipos de Geometria** da OGC é baseado no **Modelo de Geometria OpenGIS**. Nesse modelo, cada objeto geométrico possui as seguintes propriedades gerais:

* Está associado a um sistema de referência espacial, que descreve o espaço de coordenadas no qual o objeto é definido.

* Pertence a alguma aula de geometria.

#### 11.4.2.1 A Hierarquia da Classe de Geometria

As classes de geometria definem uma hierarquia da seguinte forma:

* `Geometry` (não instanciável)

+ `Point` (instanciável)
  + `Curve` (não instanciação)

- `LineString` (instanciável)

* `Line`
* `LinearRing`
+ `Surface` (não instanciável)

- `Polygon` (instanciável)
  + `GeometryCollection` (instanciável)

- `MultiPoint` (instanciável)
- `MultiCurve` (não instanciação)

* `MultiLineString` (instanciável)

- `MultiSurface` (não instanciável)

* `MultiPolygon` (instanciável)

Não é possível criar objetos em classes não instanciáveis. É possível criar objetos em classes instanciáveis. Todas as classes têm propriedades, e as classes instanciáveis também podem ter asserções (regras que definem instâncias válidas de classe).

`Geometry` é a classe base. É uma classe abstrata. As subclasses instanciáveis de `Geometry` são restritas a objetos geométricos unidimensional, bidimensional e tridimensional que existem em um espaço de coordenadas bidimensional. Todas as classes de geometria instanciáveis são definidas de modo que as instâncias válidas de uma classe de geometria são topologicamente fechadas (ou seja, todas as geometrias definidas incluem sua borda).

A classe base `Geometry` tem subclasses para `Point`, `Curve`, `Surface` e `GeometryCollection`:

* `Point` representa objetos de zero dimensão.

* `Curve` representa objetos unidimensionais e tem a subclasse `LineString`, com subsubclasses `Line` e `LinearRing`.

* `Surface` é projetado para objetos bidimensionais e possui subclasse `Polygon`.

* `GeometryCollection` possui classes de coleta especializadas de zero, um e dois dimensões, nomeadas `MultiPoint`, `MultiLineString` e `MultiPolygon`, para modelar geometrias correspondentes a coleções de `Points`, `LineStrings` e `Polygons`, respectivamente. `MultiCurve` e `MultiSurface` são introduzidas como superclasses abstratas que generalizam as interfaces de coleta para lidar com `Curves` e `Surfaces`.

`Geometry`, `Curve`, `Surface`, `MultiCurve` e `MultiSurface` são definidos como classes não instanciáveis. Eles definem um conjunto comum de métodos para suas subclasses e são incluídos para extensibilidade.

`Point`, `LineString`, `Polygon`, `GeometryCollection`, `MultiPoint`, `MultiLineString` e `MultiPolygon` são classes instanciáveis.

#### 11.4.2.2 Classe de Geometria

`Geometry` é a classe raiz da hierarquia. É uma classe não instanciável, mas possui uma série de propriedades, descritas na lista a seguir, que são comuns a todos os valores de geometria criados a partir de qualquer uma das subclasses `Geometry`. Subclasses específicas têm suas próprias propriedades específicas, descritas mais adiante.

**Propriedades Geométrica**

Um valor de geometria tem as seguintes propriedades:

* Seu **tipo**. Cada geometria pertence a uma das classes instanciáveis na hierarquia.

* Seu **SRID**, ou identificador de referência espacial. Esse valor identifica o sistema de referência espacial associado à geometria que descreve o espaço de coordenadas no qual o objeto de geometria é definido.

Em MySQL, o valor SRID é um número inteiro associado ao valor de geometria. O valor SRID máximo utilizável é 232−1. Se um valor maior for fornecido, apenas os 32 bits inferiores são utilizados. Todos os cálculos são feitos assumindo SRID 0, independentemente do valor real do SRID. O SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos.

* Suas **coordenadas** em seu sistema de referência espacial, representadas como números de dupla precisão (8 bytes). Todas as geometrias não vazias incluem pelo menos um par de coordenadas (X, Y). Geometrias vazias não contêm coordenadas.

As coordenadas estão relacionadas ao SRID. Por exemplo, em diferentes sistemas de coordenadas, a distância entre dois objetos pode diferir mesmo quando os objetos têm as mesmas coordenadas, porque a distância no sistema de coordenadas **plana** e a distância no sistema **geodésico** (coordenadas na superfície da Terra) são coisas diferentes.

* Seu **interior**, **limite** e **exterior**.

Cada geometria ocupa uma posição no espaço. O exterior de uma geometria é todo o espaço que não é ocupado pela geometria. O interior é o espaço ocupado pela geometria. A fronteira é a interface entre o interior e o exterior da geometria.

* Seu **MBR** (rectângulo mínimo de delimitação), ou envelope. Esta é a geometria de delimitação, formada pelas coordenadas mínimas e máximas (X, Y):

  ```sql
  ((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

* Se o valor é **simples** ou **não simples**. Os valores de geometria dos tipos (`LineString`, `MultiPoint`, `MultiLineString`) são simples ou não simples. Cada tipo determina suas próprias afirmações para ser simples ou não simples.

* Se o valor é **fechado** ou **não fechado**. Os valores de geometria dos tipos (`LineString`, `MultiString`) são fechados ou não fechados. Cada tipo determina suas próprias asserções para ser fechado ou não fechado.

* Se o valor é **vazio** ou **não vazio** Uma geometria é vazia se não tiver nenhum ponto. Exterior, interior e limite de uma geometria vazia não são definidos (ou seja, são representados por um valor `NULL`). Uma geometria vazia é definida como sempre simples e tem uma área de 0.

* Sua **dimensão**. Uma geometria pode ter uma dimensão de -1, 0, 1 ou 2:

+ −1 para uma geometria vazia.  
  + 0 para uma geometria sem comprimento e sem área.  
  + 1 para uma geometria com comprimento não nulo e área zero.  
  + 2 para uma geometria com área não nulo.

Objetos `Point` têm uma dimensão de zero. Objetos `LineString` têm uma dimensão de

1. Os objetos `Polygon` têm uma dimensão de

#### 11.4.2.3 Classe de Pontos

Um `Point` é uma geometria que representa um único local no espaço de coordenadas.

**`Point` Exemplos**

* Imagine um mapa em grande escala do mundo com muitas cidades. Um objeto `Point` poderia representar cada cidade.

* Em um mapa da cidade, um objeto `Point` pode representar uma parada de ônibus.

**`Point` Propriedades**

* Valor da coordenada X. * Valor da coordenada Y. * `Point` é definido como uma geometria de dimensão zero.

* A fronteira de um `Point` é o conjunto vazio.

#### 11.4.2.4 Classe de curva

Um `Curve` é uma geometria unidimensional, geralmente representada por uma sequência de pontos. Subclasses particulares de `Curve` definem o tipo de interpolação entre os pontos. `Curve` é uma classe não instanciável.

**`Curve` Propriedades**

* Um `Curve` tem as coordenadas de seus pontos.

* Um `Curve` é definido como uma geometria unidimensional.

* Um `Curve` é simples se não passar pelo mesmo ponto duas vezes, com exceção de que uma curva ainda pode ser simples se os pontos de início e fim forem os mesmos.

* Um `Curve` é fechado se seu ponto de início for igual ao seu ponto final.

* A fronteira de um fechado `Curve` é vazia.

* A fronteira de um não fechado `Curve` consiste em seus dois pontos finais.

* Um `Curve` que é simples e fechado é um `LinearRing`.

#### 11.4.2.5 Classe LineString

Um `LineString` é um `Curve` com interpolação linear entre os pontos.

**`LineString` Exemplos**

* Em um mapa mundial, os objetos `LineString` poderiam representar rios.

* Em um mapa da cidade, os objetos `LineString` poderiam representar ruas.

**`LineString` Propriedades**

* Um `LineString` tem coordenadas de segmentos, definidas por cada par consecutivo de pontos.

* Um `LineString` é um `Line` se ele consiste exatamente em dois pontos.

* Um `LineString` é um `LinearRing` se estiver fechado e simples.

#### 11.4.2.6 Classe de superfície

Um `Surface` é uma geometria bidimensional. É uma classe não instanciável. Sua única subclasse instanciável é `Polygon`.

Superfícies simples no espaço tridimensional são isomórficas a superfícies planas.

Superfícies poliédricas são formadas "costurando" superfícies simples ao longo de seus limites; em um espaço tridimensional, superfícies poliédricas podem não ser planas como um todo.

**`Surface` Propriedades**

* Um `Surface` é definido como uma geometria bidimensional.

* A especificação OpenGIS define um `Surface` simples como uma geometria que consiste em um único "remendo" que está associado a um único limite exterior e zero ou mais limites internos.

* A fronteira de um simples `Surface` é o conjunto de curvas fechadas correspondentes às suas fronteiras exteriores e interiores.

#### 11.4.2.7 Classe Polygon

Um `Polygon` é um `Surface` plano que representa uma geometria multifacetada. É definido por uma única borda externa e zero ou mais bordas internas, onde cada borda interna define um furo no `Polygon`.

**`Polygon` Exemplos**

* Em um mapa de região, os objetos `Polygon` poderiam representar florestas, distritos, e assim por diante.

**`Polygon` Afirmações**

* A fronteira de um `Polygon` é composta por um conjunto de objetos `LinearRing` (ou seja, objetos `LineString` que são simples e fechados) que compõem suas fronteiras externas e internas.

* Um `Polygon` não tem anéis que se cruzam. Os anéis na borda de um `Polygon` podem se intersecção em um `Point`, mas apenas como uma tangente.

* Um `Polygon` não tem strings, pontos ou perfurações.

* Um `Polygon` possui um interior que é um conjunto de pontos conectados.

* Um `Polygon` pode ter furos. O exterior de um `Polygon` com furos não está conectado. Cada furo define um componente conectado do exterior.

As afirmações anteriores fazem de um `Polygon` uma geometria simples.

#### 11.4.2.8 Classe GeometryCollection

Um `GeometryCollection` é uma geometria que é uma coleção de zero ou mais geometrias de qualquer classe.

Todos os elementos de uma coleção de geometria devem estar no mesmo sistema de referência espacial (ou seja, no mesmo sistema de coordenadas). Não há outras restrições para os elementos de uma coleção de geometria, embora as subclasses de `GeometryCollection` descritas nas seções a seguir possam restringir a adesão. As restrições podem ser baseadas em:

* Tipo de elemento (por exemplo, um `MultiPoint` pode conter apenas elementos `Point`)

* Dimensão * Restrições sobre o grau de sobreposição espacial entre elementos

#### 11.4.2.9 Classe MultiPoint

Um `MultiPoint` é uma coleção de geometria composta por elementos `Point`. Os pontos não estão conectados ou ordenados de qualquer maneira.

**`MultiPoint` Exemplos**

* Em um mapa mundial, um `MultiPoint` pode representar uma cadeia de pequenas ilhas.

* Em um mapa da cidade, um `MultiPoint` pode representar as saídas de uma bilheteria.

**`MultiPoint` Propriedades**

* Um `MultiPoint` é uma geometria de dimensão zero.

* Um `MultiPoint` é simples se nenhum dos seus valores de `Point` for igual (ter valores de coordenadas idênticos).

* A fronteira de um `MultiPoint` é o conjunto vazio.

#### 11.4.2.10 Classe MultiCurve

Um `MultiCurve` é uma coleção de geometria composta por elementos `Curve`. `MultiCurve` é uma classe não instanciável.

**`MultiCurve` Propriedades**

* Um `MultiCurve` é uma geometria unidimensional.

* Um `MultiCurve` é simples se e somente se todos os seus elementos são simples; as únicas interseções entre quaisquer dois elementos ocorrem em pontos que estão nas bordas de ambos os elementos.

* Uma fronteira `MultiCurve` é obtida aplicando a regra de união “mod 2” (também conhecida como regra de ímpar): um ponto está na fronteira de um `MultiCurve` se estiver nas fronteiras de um número ímpar de elementos `Curve`.

* Um `MultiCurve` é fechado se todos os seus elementos forem fechados.

* A fronteira de um fechado `MultiCurve` é sempre vazia.

#### 11.4.2.11 Classe MultiLineString

Um `MultiLineString` é uma coleção de geometria `MultiCurve` composta por elementos `LineString`.

**`MultiLineString` Exemplos**

* Em um mapa de região, um `MultiLineString` pode representar um sistema de rios ou um sistema de rodovias.

#### 11.4.2.12 Classe MultiSurface

Um `MultiSurface` é uma coleção de geometria composta por elementos de superfície. `MultiSurface` é uma classe não instanciável. Sua única subclasse instanciável é `MultiPolygon`.

**`MultiSurface` Afirmações**

* Superfícies dentro de um `MultiSurface` não possuem interiores que se interceptem.

* As superfícies dentro de um `MultiSurface` têm limites que se intersectam no máximo em um número finito de pontos.

#### 11.4.2.13 Classe MultiPolygon

Um `MultiPolygon` é um objeto `MultiSurface` composto por elementos `Polygon`.

**`MultiPolygon` Exemplos**

* Em um mapa da região, um `MultiPolygon` pode representar um sistema de pools.

**`MultiPolygon` Afirmações**

* Um `MultiPolygon` não tem dois elementos `Polygon` com interiores que se intersectam.

* Um `MultiPolygon` não tem dois elementos `Polygon` que se cruzam (a cruzamento também é proibido pela afirmação anterior), ou que tocam em um número infinito de pontos.

* Um `MultiPolygon` não pode ter strings cortadas, picos ou perfurações. Um `MultiPolygon` é um conjunto de pontos regulares e fechados.

* Um `MultiPolygon` que tem mais de um `Polygon` possui um interior que não está conectado. O número de componentes conectados do interior de um `MultiPolygon` é igual ao número de valores de `Polygon` no `MultiPolygon`.

**`MultiPolygon` Propriedades**

* Um `MultiPolygon` é uma geometria bidimensional.

* Uma `MultiPolygon` é um conjunto de curvas fechadas (valores `LineString`) correspondentes aos limites de seus elementos `Polygon`.

* Cada `Curve` na fronteira do `MultiPolygon` está na fronteira de exatamente um elemento do `Polygon`.

* Cada `Curve` na borda de um elemento `Polygon` está na borda do `MultiPolygon`.

### 11.4.3 Formatos de dados espaciais suportados

Dois formatos padrão de dados espaciais são utilizados para representar objetos geométricos em consultas:

Formato de Texto Bem Conhecido (WKT) *
Formato Binário Bem Conhecido (WKB) *

Internamente, o MySQL armazena os valores de geometria em um formato que não é idêntico ao WKT ou ao formato WKB. (O formato interno é semelhante ao WKB, mas com 4 bytes iniciais para indicar o SRID.)

Existem funções disponíveis para converter entre diferentes formatos de dados; veja a Seção 12.16.6, “Funções de conversão de formatos de geometria”.

As seções a seguir descrevem os formatos de dados espaciais que o MySQL utiliza:

* Formato de Texto Bem Conhecido (WKT) * Formato de Binário Bem Conhecido (WKB) * Formato de Armazenamento de Geometria Interna

Formato de Texto Bem Conhecido (WKT)

A representação do texto bem conhecido (WKT) dos valores de geometria é projetada para a troca de dados de geometria em formato ASCII. A especificação OpenGIS fornece uma gramática Backus-Naur que especifica as regras de produção formal para a escrita de valores WKT (ver Seção 11.4, “Tipos de dados espaciais”).

Exemplos de representações WKT de objetos geométricos:

* Um `Point`:

  ```sql
  POINT(15 20)
  ```

As coordenadas dos pontos são especificadas sem vírgula separadora. Isso difere da sintaxe para a função SQL `Point()`, que requer uma vírgula entre as coordenadas. Tenha cuidado em usar a sintaxe apropriada para o contexto de uma operação espacial dada. Por exemplo, as seguintes declarações usam `ST_X()` para extrair a coordenada X de um objeto `Point`. A primeira produz o objeto diretamente usando a função `Point()`. A segunda usa uma representação WKT convertida em um `Point` com `ST_GeomFromText()`.

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

* Um `LineString` com quatro pontos:

  ```sql
  LINESTRING(0 0, 10 10, 20 25, 50 60)
  ```

Os pares de coordenadas de ponto são separados por vírgulas.

* Um `Polygon` com um anel externo e um anel interno:

  ```sql
  POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))
  ```

* Um `MultiPoint` com três valores `Point`:

  ```sql
  MULTIPOINT(0 0, 20 20, 60 60)
  ```

A partir do MySQL 5.7.9, as funções espaciais, como `ST_MPointFromText()` e `ST_GeomFromText()`, que aceitam representações de valores WKT-format do `MultiPoint`, permitem que os pontos individuais dentro dos valores sejam cercados por parênteses. Por exemplo, ambas as chamadas de função a seguir são válidas, enquanto que antes do MySQL 5.7.9, a segunda produz um erro:

  ```sql
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

A partir do MySQL 5.7.9, a saída para os valores de `MultiPoint` inclui parênteses em torno de cada ponto. Por exemplo:

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

* Um `MultiLineString` com dois valores `LineString`:

  ```sql
  MULTILINESTRING((10 10, 20 20), (15 15, 30 15))
  ```

* Um `MultiPolygon` com dois valores `Polygon`:

  ```sql
  MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7, 5 5)))
  ```

* Um `GeometryCollection` composto por dois valores `Point` e um `LineString`:

  ```sql
  GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))
  ```

Formato Binário Bem Conhecido (WKB)

A representação binária bem conhecida (WKB) de valores geométricos é usada para a troca de dados geométricos como fluxos binários representados por valores `BLOB` que contêm informações WKB geométricas. Esse formato é definido pela especificação OpenGIS (veja a Seção 11.4, “Tipos de dados espaciais”). Também é definido no padrão ISO *SQL/MM Parte 3: Espacial*.

O WKB utiliza inteiros sem sinal de 1 byte, inteiros sem sinal de 4 bytes e números de dupla precisão de 8 bytes (formato IEEE 754). Um byte é composto por oito bits.

Por exemplo, um valor WKB que corresponde a `POINT(1 -1)` consiste nessa sequência de 21 bytes, cada um representado por dois algarismos hexadecimais:

```sql
0101000000000000000000F03F000000000000F0BF
```

A sequência é composta pelos componentes mostrados na tabela a seguir.

**Tabela 11.2 Exemplo de Componentes WKB**

<table summary="Example showing component in WKB values."><col style="width: 30%"/><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Component</th> <th>Size</th> <th>Value</th> </tr></thead><tbody><tr> <th>Byte order</th> <td>1 byte</td> <td><code>01</code></td> </tr><tr> <th>WKB type</th> <td>4 bytes</td> <td><code>01000000</code></td> </tr><tr> <th>X coordinate</th> <td>8 bytes</td> <td><code>000000000000F03F</code></td> </tr><tr> <th>Y coordinate</th> <td>8 bytes</td> <td><code>000000000000F0BF</code></td> </tr></tbody></table>

A representação dos componentes é a seguinte:

* O indicador de ordem de byte é 1 ou 0 para indicar armazenamento em ordem de byte little-endian ou big-endian. As ordens de byte little-endian e big-endian também são conhecidas como Representação de Dados de Rede (NDR) e Representação de Dados Externo (XDR), respectivamente.

* O tipo WKB é um código que indica o tipo de geometria. O MySQL utiliza valores de 1 a 7 para indicar `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon` e `GeometryCollection`.

* Um valor de `Point` tem coordenadas X e Y, cada uma representada como um valor de dupla precisão.

Os valores WKB para valores de geometria mais complexos possuem estruturas de dados mais complexas, conforme detalhado na especificação OpenGIS.

#### Formato de Armazenamento de Geometria Interna

O MySQL armazena valores de geometria usando 4 bytes para indicar o SRID seguido pela representação WKB do valor. Para uma descrição do formato WKB, consulte o formato Well-Known Binary (WKB) ("Formato Well-Known Binary").

Para a parte WKB, essas considerações específicas do MySQL se aplicam:

* O byte indicador de ordem de bytes é 1 porque o MySQL armazena geometrias como valores little-endian.

* O MySQL suporta os tipos de geometria `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon` e `GeometryCollection`. Outros tipos de geometria não são suportados.

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

* 4 bytes para o número inteiro SRID (0)
* 1 byte para a ordem de bytes inteira (1 = little-endian)
* 4 bytes para informações de tipo de número inteiro (1 = `Point`)

* 8 bytes para a coordenada X de dupla precisão (1)
* 8 bytes para a coordenada Y de dupla precisão (−1)

### 11.4.4 Geometria Bem Formada e Validade

Para os valores de geometria, o MySQL distingue entre os conceitos de bem formado sintaticamente e geometricamente válidos.

Uma geometria é sintaticamente bem formada se satisfazer condições como as desta (não exaustiva) lista:

* As strings retas têm pelo menos dois pontos
* Os polígonos têm pelo menos um anel
* Os anéis poligonais são fechados (os primeiros e os últimos pontos são os mesmos)
* Os anéis poligonais têm pelo menos 4 pontos (o polígono mínimo é um triângulo com os primeiros e os últimos pontos iguais)

* As coleções não estão vazias (exceto `GeometryCollection`)

Uma geometria é geométricamente válida se for sintaticamente bem formada e satisfaça condições, como as desta (não exaustiva) lista:

* Polígonos não se intersectam mutuamente
* Anéis internos de polígonos estão dentro do anel externo
* Multipolígonos não têm polígonos sobrepostos

As funções espaciais falham se uma geometria não for bem formada sintaticamente. As funções de importação espacial que analisam valores WKT ou WKB geram um erro para tentativas de criar uma geometria que não seja bem formada sintaticamente. A formação sintática também é verificada para tentativas de armazenar geometrias em tabelas.

É permitido inserir, selecionar e atualizar geometrias geometricamente inválidas, mas elas devem ser bem formadas sintaticamente. Devido ao custo computacional, o MySQL não verifica explicitamente a validade geométrica. Os cálculos espaciais podem detectar alguns casos de geometrias inválidas e gerar um erro, mas também podem retornar um resultado indefinido sem detectar a invalidade. Aplicações que exigem geometrias válidas geometricamente devem verificá-las usando a função `ST_IsValid()`.

### 11.4.5 Criando Colunas Espaciais

O MySQL oferece uma maneira padrão de criar colunas espaciais para tipos de geometria, por exemplo, com `CREATE TABLE`(create-table.html "13.1.18 CREATE TABLE Statement") ou `ALTER TABLE`. Colunas espaciais são suportadas para as tabelas `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE`. Consulte também as notas sobre índices espaciais na Seção 11.4.9, “Criando índices espaciais”.

* Use a declaração `CREATE TABLE` para criar uma tabela com uma coluna espacial:

  ```sql
  CREATE TABLE geom (g GEOMETRY);
  ```

* Use a declaração `ALTER TABLE` para adicionar ou excluir uma coluna espacial a uma tabela existente ou de uma tabela existente:

  ```sql
  ALTER TABLE geom ADD pt POINT;
  ALTER TABLE geom DROP pt;
  ```

### 11.4.6 Populando Colunas Espaciais

Depois de criar colunas espaciais, você pode preenchê-las com dados espaciais.

Os valores devem ser armazenados no formato de geometria interna, mas você pode convertê-los nesse formato a partir do texto bem conhecido (WKT) ou binário bem conhecido (WKB). Os exemplos a seguir demonstram como inserir valores de geometria em uma tabela, convertendo os valores WKT para o formato de geometria interna:

* Realize a conversão diretamente na declaração `INSERT`:

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

Um programa de aplicação cliente que deseja usar representações WKB de valores de geometria é responsável por enviar WKB corretamente formado em consultas ao servidor. Existem várias maneiras de atender a essa exigência. Por exemplo:

* Inserindo um valor `POINT(1 1)` com sintaxe literal hexadecimal:

  ```sql
  INSERT INTO geom VALUES
  (ST_GeomFromWKB(X'0101000000000000000000F03F000000000000F03F'));
  ```

* Uma aplicação ODBC pode enviar uma representação WKB, vinculando-a a um localizador usando um argumento do tipo `BLOB`:

  ```sql
  INSERT INTO geom VALUES (ST_GeomFromWKB(?))
  ```

Outras interfaces de programação podem suportar um mecanismo de marcador semelhante.

* Em um programa em C, você pode escapar um valor binário usando `mysql_real_escape_string_quote()` e incluir o resultado em uma string de consulta que é enviada ao servidor. Veja mysql\_real\_escape\_string\_quote().

### 11.4.7 Extraindo Dados Espaciais

Os valores de geometria armazenados em uma tabela podem ser recuperados no formato interno. Você também pode convertê-los para o formato WKT ou WKB.

* Recuperação de dados espaciais em formato interno:

Obter valores de geometria usando o formato interno pode ser útil em transferências entre tabelas:

  ```sql
  CREATE TABLE geom2 (g GEOMETRY) SELECT g FROM geom;
  ```

* Obtendo dados espaciais no formato WKT:

A função `ST_AsText()` converte uma geometria do formato interno para uma string WKT.

  ```sql
  SELECT ST_AsText(g) FROM geom;
  ```

* Recuperação de dados espaciais no formato WKB:

A função `ST_AsBinary()` converte uma geometria do formato interno para um `BLOB` que contém o valor WKB.

  ```sql
  SELECT ST_AsBinary(g) FROM geom;
  ```

### 11.4.8 Otimizando Análise Espacial

Para as tabelas `MyISAM` e `InnoDB`, as operações de busca em colunas que contêm dados espaciais podem ser otimizadas usando índices `SPATIAL`. As operações mais típicas são:

* Perguntas que buscam todos os objetos que contêm um ponto dado

* Região: consultas que buscam todos os objetos que se sobrepõem a uma região dada

O MySQL utiliza **R-Trees com divisão quadrática** para índices `SPATIAL` em colunas espaciais. Um índice `SPATIAL` é construído usando o retângulo mínimo de delimitação (MBR) de uma geometria. Para a maioria das geometrias, o MBR é um retângulo mínimo que envolve as geometrias. Para uma string horizontal ou vertical, o MBR é um retângulo degenerado na string. Para um ponto, o MBR é um retângulo degenerado no ponto.

É também possível criar índices normais em colunas espaciais. Em um índice não `SPATIAL`, você deve declarar um prefixo para qualquer coluna espacial, exceto as colunas `POINT`.

`MyISAM` e `InnoDB` suportam tanto índices `SPATIAL` quanto índices não `SPATIAL`. Outros motores de armazenamento suportam índices não `SPATIAL`, conforme descrito na Seção 13.1.14, "Instrução CREATE INDEX".

### 11.4.9 Criando índices espaciais

Para as tabelas `InnoDB` e `MyISAM`, o MySQL pode criar índices espaciais usando uma sintaxe semelhante àquela para criar índices regulares, mas usando a palavra-chave `SPATIAL`. As colunas dos índices espaciais devem ser declaradas `NOT NULL`. Os seguintes exemplos demonstram como criar índices espaciais:

* Com `CREATE TABLE`:

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL, SPATIAL INDEX(g));
  ```

* Com `ALTER TABLE`:

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g);
  ```

* Com `CREATE INDEX`:

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  CREATE SPATIAL INDEX g ON geom (g);
  ```

`SPATIAL INDEX` cria um índice de árvore R. Para motores de armazenamento que suportam indexação não espacial de colunas espaciais, o motor cria um índice de árvore B. Um índice de árvore B em valores espaciais é útil para consultas de valor exato, mas não para varreduras de intervalo.

Para mais informações sobre indexação de colunas espaciais, consulte a Seção 13.1.14, “Instrução CREATE INDEX”.

Para descartar índices espaciais, use `ALTER TABLE` (alter-table.html "13.1.8 ALTER TABLE Statement") ou `DROP INDEX`:

* Com `ALTER TABLE`:

  ```sql
  ALTER TABLE geom DROP INDEX g;
  ```

* Com `DROP INDEX`:

  ```sql
  DROP INDEX g ON geom;
  ```

Exemplo: Suponha que uma tabela `geom` contenha mais de 32.000 geometrias, que são armazenadas na coluna `g` do tipo `GEOMETRY`. A tabela também possui uma coluna `AUTO_INCREMENT` `fid` para armazenar valores de ID de objeto.

```sql
mysql> DESCRIBE geom;
+-------+----------+------+-----+---------+----------------+
| Field | Type     | Null | Key | Default | Extra          |
+-------+----------+------+-----+---------+----------------+
| fid   | int(11)  |      | PRI | NULL    | auto_increment |
| g     | geometry |      |     |         |                |
+-------+----------+------+-----+---------+----------------+
2 rows in set (0.00 sec)

mysql> SELECT COUNT(*) FROM geom;
+----------+
| count(*) |
+----------+
|    32376 |
+----------+
1 row in set (0.00 sec)
```

Para adicionar um índice espacial na coluna `g`, use esta declaração:

```sql
mysql> ALTER TABLE geom ADD SPATIAL INDEX(g);
Query OK, 32376 rows affected (4.05 sec)
Records: 32376  Duplicates: 0  Warnings: 0
```

### 11.4.10 Uso de índices espaciais

O otimizador investiga se índices espaciais disponíveis podem ser envolvidos na busca de consultas que utilizam uma função como `MBRContains()` ou `MBRWithin()` na cláusula `WHERE`. A consulta a seguir encontra todos os objetos que estão no retângulo dado:

```sql
mysql> SET @poly =
    -> 'Polygon((30000 15000,
                 31000 15000,
                 31000 16000,
                 30000 16000,
                 30000 15000))';
mysql> SELECT fid,ST_AsText(g) FROM geom WHERE
    -> MBRContains(ST_GeomFromText(@poly),g);
+-----+---------------------------------------------------------------+
| fid | ST_AsText(g)                                                  |
+-----+---------------------------------------------------------------+
|  21 | LINESTRING(30350.4 15828.8,30350.6 15845,30333.8 15845,30 ... |
|  22 | LINESTRING(30350.6 15871.4,30350.6 15887.8,30334 15887.8, ... |
|  23 | LINESTRING(30350.6 15914.2,30350.6 15930.4,30334 15930.4, ... |
|  24 | LINESTRING(30290.2 15823,30290.2 15839.4,30273.4 15839.4, ... |
|  25 | LINESTRING(30291.4 15866.2,30291.6 15882.4,30274.8 15882. ... |
|  26 | LINESTRING(30291.6 15918.2,30291.6 15934.4,30275 15934.4, ... |
| 249 | LINESTRING(30337.8 15938.6,30337.8 15946.8,30320.4 15946. ... |
|   1 | LINESTRING(30250.4 15129.2,30248.8 15138.4,30238.2 15136. ... |
|   2 | LINESTRING(30220.2 15122.8,30217.2 15137.8,30207.6 15136, ... |
|   3 | LINESTRING(30179 15114.4,30176.6 15129.4,30167 15128,3016 ... |
|   4 | LINESTRING(30155.2 15121.4,30140.4 15118.6,30142 15109,30 ... |
|   5 | LINESTRING(30192.4 15085,30177.6 15082.2,30179.2 15072.4, ... |
|   6 | LINESTRING(30244 15087,30229 15086.2,30229.4 15076.4,3024 ... |
|   7 | LINESTRING(30200.6 15059.4,30185.6 15058.6,30186 15048.8, ... |
|  10 | LINESTRING(30179.6 15017.8,30181 15002.8,30190.8 15003.6, ... |
|  11 | LINESTRING(30154.2 15000.4,30168.6 15004.8,30166 15014.2, ... |
|  13 | LINESTRING(30105 15065.8,30108.4 15050.8,30118 15053,3011 ... |
| 154 | LINESTRING(30276.2 15143.8,30261.4 15141,30263 15131.4,30 ... |
| 155 | LINESTRING(30269.8 15084,30269.4 15093.4,30258.6 15093,30 ... |
| 157 | LINESTRING(30128.2 15011,30113.2 15010.2,30113.6 15000.4, ... |
+-----+---------------------------------------------------------------+
20 rows in set (0.00 sec)
```

Use `EXPLAIN` para verificar a forma como essa consulta é executada:

```sql
mysql> SET @poly =
    -> 'Polygon((30000 15000,
                 31000 15000,
                 31000 16000,
                 30000 16000,
                 30000 15000))';
mysql> EXPLAIN SELECT fid,ST_AsText(g) FROM geom WHERE
    -> MBRContains(ST_GeomFromText(@poly),g)\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: geom
         type: range
possible_keys: g
          key: g
      key_len: 32
          ref: NULL
         rows: 50
        Extra: Using where
1 row in set (0.00 sec)
```

Verifique o que aconteceria sem um índice espacial:

```sql
mysql> SET @poly =
    -> 'Polygon((30000 15000,
                 31000 15000,
                 31000 16000,
                 30000 16000,
                 30000 15000))';
mysql> EXPLAIN SELECT fid,ST_AsText(g) FROM g IGNORE INDEX (g) WHERE
    -> MBRContains(ST_GeomFromText(@poly),g)\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: geom
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 32376
        Extra: Using where
1 row in set (0.00 sec)
```

Executar a declaração `SELECT` sem o índice espacial produz o mesmo resultado, mas faz com que o tempo de execução aumente de 0,00 segundos para 0,46 segundos:

```sql
mysql> SET @poly =
    -> 'Polygon((30000 15000,
                 31000 15000,
                 31000 16000,
                 30000 16000,
                 30000 15000))';
mysql> SELECT fid,ST_AsText(g) FROM geom IGNORE INDEX (g) WHERE
    -> MBRContains(ST_GeomFromText(@poly),g);
+-----+---------------------------------------------------------------+
| fid | ST_AsText(g)                                                  |
+-----+---------------------------------------------------------------+
|   1 | LINESTRING(30250.4 15129.2,30248.8 15138.4,30238.2 15136. ... |
|   2 | LINESTRING(30220.2 15122.8,30217.2 15137.8,30207.6 15136, ... |
|   3 | LINESTRING(30179 15114.4,30176.6 15129.4,30167 15128,3016 ... |
|   4 | LINESTRING(30155.2 15121.4,30140.4 15118.6,30142 15109,30 ... |
|   5 | LINESTRING(30192.4 15085,30177.6 15082.2,30179.2 15072.4, ... |
|   6 | LINESTRING(30244 15087,30229 15086.2,30229.4 15076.4,3024 ... |
|   7 | LINESTRING(30200.6 15059.4,30185.6 15058.6,30186 15048.8, ... |
|  10 | LINESTRING(30179.6 15017.8,30181 15002.8,30190.8 15003.6, ... |
|  11 | LINESTRING(30154.2 15000.4,30168.6 15004.8,30166 15014.2, ... |
|  13 | LINESTRING(30105 15065.8,30108.4 15050.8,30118 15053,3011 ... |
|  21 | LINESTRING(30350.4 15828.8,30350.6 15845,30333.8 15845,30 ... |
|  22 | LINESTRING(30350.6 15871.4,30350.6 15887.8,30334 15887.8, ... |
|  23 | LINESTRING(30350.6 15914.2,30350.6 15930.4,30334 15930.4, ... |
|  24 | LINESTRING(30290.2 15823,30290.2 15839.4,30273.4 15839.4, ... |
|  25 | LINESTRING(30291.4 15866.2,30291.6 15882.4,30274.8 15882. ... |
|  26 | LINESTRING(30291.6 15918.2,30291.6 15934.4,30275 15934.4, ... |
| 154 | LINESTRING(30276.2 15143.8,30261.4 15141,30263 15131.4,30 ... |
| 155 | LINESTRING(30269.8 15084,30269.4 15093.4,30258.6 15093,30 ... |
| 157 | LINESTRING(30128.2 15011,30113.2 15010.2,30113.6 15000.4, ... |
| 249 | LINESTRING(30337.8 15938.6,30337.8 15946.8,30320.4 15946. ... |
+-----+---------------------------------------------------------------+
20 rows in set (0.46 sec)
```
