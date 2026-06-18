## 11.4 Tipos de Dados Spatial

11.4.1 Tipos de Dados Spatial

11.4.2 O Modelo Geometry OpenGIS

11.4.3 Formatos de Dados Spatial Suportados

11.4.4 Boa Formação e Validade de Geometry

11.4.5 Criando Colunas Spatial

11.4.6 Preenchendo Colunas Spatial

11.4.7 Obtendo Dados Spatial

11.4.8 Otimizando Análises Spatial

11.4.9 Criando Spatial Indexes

11.4.10 Usando Spatial Indexes

O Open Geospatial Consortium (OGC) é um consórcio internacional de mais de 250 empresas, agências e universidades que participam do desenvolvimento de soluções conceituais disponíveis publicamente que podem ser úteis em todos os tipos de aplicações que gerenciam dados spatial.

O Open Geospatial Consortium publica o *OpenGIS® Implementation Standard for Geographic information - Simple Feature Access - Part 2: SQL Option*, um documento que propõe várias maneiras conceituais de estender um SQL RDBMS para suportar dados spatial. Esta especificação está disponível no website do OGC em <http://www.opengeospatial.org/standards/sfs>.

Seguindo a especificação do OGC, o MySQL implementa extensões spatial como um subconjunto do ambiente **SQL with Geometry Types**. Este termo se refere a um ambiente SQL que foi estendido com um conjunto de tipos de geometry. Uma coluna SQL com valor geometry é implementada como uma coluna que possui um tipo geometry. A especificação descreve um conjunto de tipos de geometry SQL, bem como funções nesses tipos para criar e analisar valores geometry.

As extensões spatial do MySQL permitem a geração, armazenamento e análise de geographic features:

* Tipos de dados para representar valores spatial
* Funções para manipular valores spatial
* Spatial indexing para tempos de acesso aprimorados a colunas spatial

Os tipos de dados e funções spatial estão disponíveis para tabelas `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE`. Para indexar colunas spatial, `MyISAM` e `InnoDB` suportam tanto indexes `SPATIAL` quanto não-`SPATIAL`. Os outros storage engines suportam indexes não-`SPATIAL`, conforme descrito na Seção 13.1.14, “CREATE INDEX Statement”.

Um **geographic feature** é qualquer coisa no mundo que tem uma localização. Um feature pode ser:

* Uma entidade. Por exemplo, uma montanha, um lago, uma cidade.
* Um espaço. Por exemplo, um distrito municipal, os trópicos.
* Uma localização definível. Por exemplo, um cruzamento, como um lugar particular onde duas ruas se cruzam.

Alguns documentos usam o termo **geospatial feature** para se referir a geographic features.

**Geometry** é outra palavra que denota um geographic feature. Originalmente, a palavra **geometry** significava medição da terra. Outro significado vem da cartografia, referindo-se aos geometric features que os cartógrafos usam para mapear o mundo.

A discussão aqui considera estes termos sinônimos: **geographic feature**, **geospatial feature**, **feature** ou **geometry**. O termo mais comumente usado é **geometry**, definido como *um ponto ou um agregado de pontos representando qualquer coisa no mundo que tem uma localização*.

O material a seguir aborda estes tópicos:

* O modelo de tipos de dados spatial implementado no MySQL
* A base das extensões spatial no modelo OpenGIS geometry

* Formatos de dados para representar dados spatial
* Como usar dados spatial no MySQL
* Uso de indexing para dados spatial
* Diferenças do MySQL em relação à especificação OpenGIS

Para informações sobre funções que operam em dados spatial, veja a Seção 12.16, “Spatial Analysis Functions”.

### Conformidade e Compatibilidade GIS do MySQL

O MySQL não implementa os seguintes GIS features:

* Additional Metadata Views

  As especificações OpenGIS propõem vários additional metadata views. Por exemplo, uma system view chamada `GEOMETRY_COLUMNS` contém uma descrição de colunas geometry, uma linha para cada coluna geometry no Database.

* A função OpenGIS `Length()` em `LineString` e `MultiLineString` deve ser chamada no MySQL como `ST_Length()`

  O problema é que existe uma função SQL `Length()` que calcula o comprimento de valores string, e às vezes não é possível distinguir se a função é chamada em um contexto textual ou spatial.

### Recursos Adicionais

O Open Geospatial Consortium publica o *OpenGIS® Implementation Standard for Geographic information - Simple feature access - Part 2: SQL option*, um documento que propõe várias maneiras conceituais de estender um SQL RDBMS para suportar dados spatial. O Open Geospatial Consortium (OGC) mantém um website em <http://www.opengeospatial.org/>. A especificação está disponível lá em <http://www.opengeospatial.org/standards/sfs>. Ela contém informações adicionais relevantes ao material aqui.

Se você tiver perguntas ou preocupações sobre o uso das extensões spatial para MySQL, você pode discuti-las no fórum GIS: <https://forums.mysql.com/list.php?23>.
