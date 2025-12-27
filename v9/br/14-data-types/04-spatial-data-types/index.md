## 13.4 Tipos de Dados Espaciais

13.4.1 Tipos de Dados Espaciais

13.4.2 O Modelo de Geometria OpenGIS

13.4.3 Formatos de Dados Espaciais Compatíveis

13.4.4 Formação e Validade da Geometria

13.4.5 Suporte a Sistemas de Referência Espacial

13.4.6 Criação de Colunas Espaciais

13.4.7 Preenchimento de Colunas Espaciais

13.4.8 Recuperação de Dados Espaciais

13.4.9 Otimização da Análise Espacial

13.4.10 Criação de Índices Espaciais

O Consórcio Open Geospatial (OGC) é um consórcio internacional composto por mais de 250 empresas, agências e universidades que participam do desenvolvimento de soluções conceituais disponíveis ao público que podem ser úteis para todos os tipos de aplicações que gerenciam dados espaciais.

O Consórcio Open Geospatial publica o *Padrão de Implementação OpenGIS para Informações Geográficas - Acesso a Recursos Simples - Parte 2: Opção SQL*, um documento que propõe várias maneiras conceituais de estender um RDBMS SQL para suportar dados espaciais. Esta especificação está disponível no site do OGC em <http://www.opengeospatial.org/standards/sfs>.

Seguindo a especificação do OGC, o MySQL implementa extensões espaciais como um subconjunto do ambiente **SQL com Tipos de Geometria**. Este termo refere-se a um ambiente SQL que foi estendido com um conjunto de tipos de geometria. Uma coluna SQL com valor de geometria é implementada como uma coluna que tem um tipo de geometria. A especificação descreve um conjunto de tipos de geometria SQL, bem como funções sobre esses tipos para criar e analisar valores de geometria.

As extensões espaciais do MySQL permitem a geração, armazenamento e análise de características geográficas:

* Tipos de dados para representar valores espaciais
* Funções para manipular valores espaciais
* Indexação espacial para tempos de acesso melhorados a colunas espaciais

Os tipos de dados espaciais e as funções estão disponíveis para as tabelas `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE`. Para indexar colunas espaciais, `MyISAM` e `InnoDB` suportam tanto índices `SPATIAL` quanto não `SPATIAL`. Os outros motores de armazenamento suportam índices não `SPATIAL`, conforme descrito na Seção 15.1.18, “Instrução CREATE INDEX”.

Uma **característica geográfica** é qualquer coisa no mundo que tenha uma localização. Uma característica pode ser:

* Uma entidade. Por exemplo, uma montanha, um lago, uma cidade.
* Um espaço. Por exemplo, distrito da cidade, os trópicos.
* Uma localização definível. Por exemplo, uma encruzilhada, como um lugar específico onde duas ruas se cruzam.

Alguns documentos usam o termo **característica geoespacial** para se referir a características geográficas.

**Geometria** é outra palavra que denota uma característica geográfica. Originalmente, a palavra **geometria** significava medição da terra. Outro significado vem da cartografia, referindo-se às características geométricas que os cartógrafos usam para mapear o mundo.

A discussão aqui considera esses termos sinônimos: **característica geográfica**, **característica geoespacial**, **característica** ou **geometria**. O termo mais comumente usado é **geometria**, definido como *um ponto ou um agregado de pontos representando qualquer coisa no mundo que tenha uma localização*.

O material a seguir aborda esses tópicos:

* Os tipos de dados espaciais implementados no modelo MySQL
* A base das extensões espaciais no modelo de geometria OpenGIS

* Formatos de dados para representar dados espaciais
* Como usar dados espaciais no MySQL
* Uso de indexação para dados espaciais
* Diferenças do MySQL em relação à especificação OpenGIS

Para informações sobre funções que operam em dados espaciais, consulte a Seção 14.16, “Funções de Análise Espacial”.

### Recursos Adicionais

Esses padrões são importantes para a implementação do MySQL de operações espaciais:

* SQL/MM Parte 3: Espacial.
* O Consórcio de Geoprocessamento Aberto publica o *Padrão de Implementação OpenGIS para Informações Geográficas*, um documento que propõe várias maneiras conceituais para estender um RDBMS SQL para suportar dados espaciais. Veja, em particular, Acesso a Recursos Simples - Parte 1: Arquitetura Comum e Acesso a Recursos Simples - Parte 2: Opção SQL. O Consórcio de Geoprocessamento Aberto (OGC) mantém um site em <http://www.opengeospatial.org/>. A especificação está disponível lá em <http://www.opengeospatial.org/standards/sfs>. Ela contém informações adicionais relevantes para o material aqui.

* A gramática para definições de sistemas de referência espaciais (SRS) é baseada na gramática definida no *Padrão de Implementação OpenGIS: Serviços de Transformação de Coordenadas*, Revisão 1.00, OGC 01-009, 12 de janeiro de 2001, Seção 7.2. Esta especificação está disponível em <http://www.opengeospatial.org/standards/ct>. Para diferenças dessa especificação nas definições de SRS implementadas no MySQL, consulte a Seção 15.1.23, “Instrução CREATE SPATIAL REFERENCE SYSTEM”.

Se você tiver dúvidas ou preocupações sobre o uso das extensões espaciais para MySQL, pode discutir isso no fórum de SIG: <https://forums.mysql.com/list.php?23>.