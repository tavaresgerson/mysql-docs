## 11.4 Tipos de dados espaciais

11.4.1 Tipos de Dados Espaciais

11.4.2 O Modelo de Geometria OpenGIS

11.4.3 Formas de dados espaciais suportadas

11.4.4 Geometria - Formação e Validade

11.4.5 Criando Colunas Espaciais

11.4.6 População de Colunas Espaciais

11.4.7 Recuperação de Dados Espaciais

11.4.8 Otimização da Análise Espacial

11.4.9 Criação de índices espaciais

11.4.10 Uso de índices espaciais

O Consórcio de Geoprocessamento Aberto (OGC) é um consórcio internacional composto por mais de 250 empresas, agências e universidades que participam do desenvolvimento de soluções conceituais disponíveis publicamente, que podem ser úteis para todos os tipos de aplicações que gerenciam dados espaciais.

O Consórcio de Geoprocessamento Aberto publica o *Padrão de Implementação OpenGIS® para Informações Geográficas - Acesso a Recursos Simples - Parte 2: Opção SQL*, um documento que propõe várias maneiras conceituais de estender um RDBMS SQL para suportar dados espaciais. Esta especificação está disponível no site do OGC em <http://www.opengeospatial.org/standards/sfs>.

De acordo com a especificação OGC, o MySQL implementa extensões espaciais como um subconjunto do ambiente **SQL com Tipos de Geometria**. Este termo refere-se a um ambiente SQL que foi estendido com um conjunto de tipos de geometria. Uma coluna SQL com valor de geometria é implementada como uma coluna que tem um tipo de geometria. A especificação descreve um conjunto de tipos de geometria SQL, bem como funções sobre esses tipos para criar e analisar valores de geometria.

As extensões espaciais do MySQL permitem a geração, armazenamento e análise de características geográficas:

- Tipos de dados para representar valores espaciais
- Funções para manipulação de valores espaciais
- Indexação espacial para tempos de acesso melhorados às colunas espaciais

Os tipos de dados espaciais e as funções estão disponíveis para as tabelas `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE`. Para indexar colunas espaciais, `MyISAM` e `InnoDB` suportam tanto índices `SPATIAL` quanto não `SPATIAL`. Os outros motores de armazenamento suportam índices não `SPATIAL`, conforme descrito na Seção 13.1.14, “Instrução CREATE INDEX”.

Uma **característica geográfica** é qualquer coisa no mundo que tenha uma localização. Uma característica pode ser:

- Uma entidade. Por exemplo, uma montanha, um lago, uma cidade.
- Um espaço. Por exemplo, bairro da cidade, os trópicos.
- Um local definível. Por exemplo, uma encruzilhada, como um lugar específico onde duas ruas se cruzam.

Alguns documentos usam o termo **característica geoespacial** para se referir a características geográficas.

**Geometria** é outra palavra que denota uma característica geográfica. Originalmente, a palavra **geometria** significava medição da terra. Outro significado vem da cartografia, referindo-se às características geométricas que os cartógrafos usam para mapear o mundo.

A discussão aqui considera esses termos sinônimos: **característica geográfica**, **característica geoespacial**, **característica** ou **geometria**. O termo mais comumente usado é **geometria**, definido como *um ponto ou um agregado de pontos representando qualquer coisa no mundo que tenha uma localização*.

O material a seguir aborda esses tópicos:

- Os tipos de dados espaciais implementados no modelo MySQL

- A base das extensões espaciais no modelo de geometria OpenGIS

- Formulários de dados para representar dados espaciais

- Como usar dados espaciais no MySQL

- Uso de indexação para dados espaciais

- Diferenças do MySQL em relação à especificação OpenGIS

Para obter informações sobre as funções que operam em dados espaciais, consulte a Seção 12.16, “Funções de Análise Espacial”.

### Conformação e compatibilidade do MySQL GIS

O MySQL não implementa as seguintes funcionalidades GIS:

- Visualizações de metadados adicionais

  As especificações OpenGIS propõem várias visualizações de metadados adicionais. Por exemplo, uma visualização de sistema chamada `GEOMETRY_COLUMNS` contém uma descrição das colunas de geometria, uma linha para cada coluna de geometria no banco de dados.

- A função OpenGIS `Length()` em `LineString` e `MultiLineString` deve ser chamada no MySQL como `ST_Length()`

  O problema é que existe uma função SQL existente `Length()` que calcula o comprimento dos valores de string, e às vezes não é possível distinguir se a função está sendo chamada em um contexto textual ou espacial.

### Recursos adicionais

O Consórcio de Geoprocessamento Aberto publica o *Padrão de Implementação OpenGIS® para Informações Geográficas - Acesso Simples a Recursos - Parte 2: Opção SQL*, um documento que propõe várias maneiras conceituais de estender um RDBMS SQL para suportar dados espaciais. O Consórcio de Geoprocessamento Aberto (OGC) mantém um site em <http://www.opengeospatial.org/>. A especificação está disponível lá em <http://www.opengeospatial.org/standards/sfs>. Ele contém informações adicionais relevantes para o material aqui.

Se você tiver dúvidas ou preocupações sobre o uso das extensões espaciais para MySQL, você pode discutir isso no fórum de SIG: <https://forums.mysql.com/list.php?23>.
