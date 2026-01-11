## 11.7 Requisitos de armazenamento de tipos de dados

- Requisitos de Armazenamento de Tabelas InnoDB
- Requisitos de Armazenamento de Tabelas do NDB
- Requisitos de armazenamento de tipo numérico
- Data e hora Tipo Requisitos de armazenamento
- Requisitos de armazenamento do tipo de corda
- Requisitos de Armazenamento de Tipo Espacial
- Requisitos de Armazenamento JSON

Os requisitos de armazenamento para dados de tabela em disco dependem de vários fatores. Diferentes motores de armazenamento representam tipos de dados e armazenam dados brutos de maneira diferente. Os dados de tabela podem ser comprimidos, seja para uma coluna ou para toda uma linha, o que complica o cálculo dos requisitos de armazenamento para uma tabela ou coluna.

Apesar das diferenças no layout de armazenamento no disco, as APIs internas do MySQL que comunicam e trocam informações sobre as linhas das tabelas utilizam uma estrutura de dados consistente que se aplica a todos os mecanismos de armazenamento.

Esta seção inclui diretrizes e informações sobre os requisitos de armazenamento para cada tipo de dado suportado pelo MySQL, incluindo o formato interno e o tamanho para os motores de armazenamento que usam uma representação de tamanho fixo para os tipos de dados. As informações são listadas por categoria ou motor de armazenamento.

A representação interna de uma tabela tem um tamanho máximo de linha de 65.535 bytes, mesmo que o mecanismo de armazenamento seja capaz de suportar linhas maiores. Esse número exclui as colunas `BLOB` ou `TEXT`, que contribuem apenas com 9 a 12 bytes para esse tamanho. Para dados `BLOB` e `TEXT`, as informações são armazenadas internamente em uma área diferente da memória do buffer de linha. Diferentes mecanismos de armazenamento lidam com a alocação e armazenamento desses dados de maneiras diferentes, de acordo com o método que usam para lidar com os tipos correspondentes. Para mais informações, consulte o Capítulo 15, *Mecanismos de Armazenamento Alternativos*, e a Seção 8.4.7, “Limites de Contagem de Colunas de Tabela e Tamanho de Linha”.

### Requisitos de Armazenamento de Tabelas InnoDB

Consulte a Seção 14.11, “Formatos de Linhas InnoDB”, para obter informações sobre os requisitos de armazenamento para as tabelas `InnoDB`.

### Requisitos de Armazenamento de Tabelas do NDB

Importante

As tabelas `NDB` usam alinhamento de 4 bytes; todo o armazenamento de dados `NDB` é feito em múltiplos de 4 bytes. Assim, um valor de coluna que normalmente ocuparia 15 bytes requer 16 bytes em uma tabela `NDB`. Por exemplo, nas tabelas `NDB`, os tipos de coluna `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) (`INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) requerem cada um 4 bytes de armazenamento por registro devido ao fator de alinhamento.

Cada coluna `BIT(M)` ocupa *`M`* bits de espaço de armazenamento. Embora uma coluna `BIT` individual *não* esteja alinhada a 4 bytes, o `NDB` reserva 4 bytes (32 bits) por linha para os primeiros 1-32 bits necessários para as colunas `BIT`, depois outros 4 bytes para os bits 33-64, e assim por diante.

Embora um `NULL` por si só não exija espaço de armazenamento, o `NDB` reserva 4 bytes por linha se a definição da tabela contiver quaisquer colunas definidas como `NULL`, até 32 colunas `NULL`. (Se uma tabela do NDB Cluster for definida com mais de 32 colunas `NULL`, até 64 colunas `NULL`, então 8 bytes por linha são reservados.)

Cada tabela que utiliza o mecanismo de armazenamento `NDB` requer uma chave primária; se você não definir uma chave primária, a `NDB` criará uma chave primária "oculta". Essa chave primária oculta consome 31 a 35 bytes por registro da tabela.

Você pode usar o script Perl **ndb_size.pl** para estimar os requisitos de armazenamento do `NDB`. Ele se conecta a um banco de dados MySQL atual (não NDB Cluster) e cria um relatório sobre o espaço que esse banco de dados exigiria se usasse o motor de armazenamento `NDB`. Consulte a Seção 21.5.28, “ndb_size.pl — Estimator de Requisitos de Tamanho NDBCLUSTER”, para obter mais informações.

### Requisitos de armazenamento de tipo numérico

<table summary="Armazenamento necessário para tipos de dados numéricos."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Tipo de dados</th> <th>Armazenamento necessário</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>DOUBLE [PRECISION]</code>]</td> <td>1 byte</td> </tr><tr> <td>[[PH_HTML_CODE_<code>DOUBLE [PRECISION]</code>]</td> <td>2 bytes</td> </tr><tr> <td>[[PH_HTML_CODE_<code>DECIMAL(<em><code>M</code>]</td> <td>3 bytes</td> </tr><tr> <td>[[PH_HTML_CODE_<code>D</code>],[[PH_HTML_CODE_<code>NUMERIC(<em><code>M</code>]</td> <td>4 bytes</td> </tr><tr> <td>[[PH_HTML_CODE_<code>D</code>]</td> <td>8 bytes</td> </tr><tr> <td>[[PH_HTML_CODE_<code>BIT(<em><code>M</code>]</em>)</code></td> <td>4 bytes se 0 &lt;=<em>[[PH_HTML_CODE_<code>M</code>]</em>&lt;= 24, 8 bytes se 25 &lt;=<em>[[<code>p</code>]]</em>&lt;= 53</td> </tr><tr> <td>[[<code>FLOAT</code>]]</td> <td>4 bytes</td> </tr><tr> <td>[[<code>DOUBLE [PRECISION]</code>]],[[<code>SMALLINT</code><code>DOUBLE [PRECISION]</code>]</td> <td>8 bytes</td> </tr><tr> <td>[[<code>DECIMAL(<em><code>M</code>]]</em>,<em>[[<code>D</code>]]</em>)</code>, [[<code>NUMERIC(<em><code>M</code>]]</em>,<em>[[<code>D</code>]]</em>)</code></td> <td>Varia; veja a discussão a seguir</td> </tr><tr> <td>[[<code>BIT(<em><code>M</code>]]</em>)</code></td> <td>aproximadamente (<em>[[<code>M</code>]]</em>+7)/8 bytes</td> </tr></tbody></table>

Os valores das colunas `DECIMAL` - `DECIMAL`, `NUMERIC`) (e `NUMERIC` - `DECIMAL`, \`NUMERIC")) são representados usando um formato binário que compacta nove dígitos decimais (base 10) em quatro bytes. O armazenamento para as partes inteiras e fracionárias de cada valor é determinado separadamente. Cada múltiplo de nove dígitos requer quatro bytes, e os dígitos "remanescentes" requerem uma fração de quatro bytes. O armazenamento necessário para dígitos excedentes é dado pela tabela a seguir.

<table summary="Armazenamento necessário para dígitos excedentes/remanescentes em valores DECIMAL."><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Dígitos Remanescentes</th> <th>Número de bytes</th> </tr></thead><tbody><tr> <td>0</td> <td>0</td> </tr><tr> <td>1</td> <td>1</td> </tr><tr> <td>2</td> <td>1</td> </tr><tr> <td>3</td> <td>2</td> </tr><tr> <td>4</td> <td>2</td> </tr><tr> <td>5</td> <td>3</td> </tr><tr> <td>6</td> <td>3</td> </tr><tr> <td>7</td> <td>4</td> </tr><tr> <td>8</td> <td>4</td> </tr></tbody></table>

### Data e hora Tipo Requisitos de armazenamento

Para as colunas `TIME`, `DATETIME` e `TIMESTAMP`, o armazenamento necessário para tabelas criadas antes do MySQL 5.6.4 difere das tabelas criadas a partir do 5.6.4 em diante. Isso ocorre devido a uma mudança no 5.6.4 que permite que esses tipos tenham uma parte fracionária, o que exige de 0 a 3 bytes.

<table summary="Armazenamento necessário para os tipos de dados de data e hora antes do MySQL 5.6.4 e a partir do MySQL 5.6.4."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Tipo de dados</th> <th>Armazenamento necessário antes do MySQL 5.6.4</th> <th>Armazenamento necessário a partir do MySQL 5.6.4</th> </tr></thead><tbody><tr> <th>[[<code>YEAR</code>]]</th> <td>1 byte</td> <td>1 byte</td> </tr><tr> <th>[[<code>DATE</code>]]</th> <td>3 bytes</td> <td>3 bytes</td> </tr><tr> <th>[[<code>TIME</code>]]</th> <td>3 bytes</td> <td>Armazenamento de 3 bytes + segundos fracionários</td> </tr><tr> <th>[[<code>DATETIME</code>]]</th> <td>8 bytes</td> <td>5 bytes + armazenamento de segundos fracionários</td> </tr><tr> <th>[[<code>TIMESTAMP</code>]]</th> <td>4 bytes</td> <td>4 bytes + armazenamento de segundos fracionários</td> </tr></tbody></table>

A partir do MySQL 5.6.4, o armazenamento para `YEAR` e `DATE` permanece inalterado. No entanto, `TIME`, `DATETIME` e `TIMESTAMP` são representados de maneira diferente. `DATETIME` é compactado de forma mais eficiente, exigindo 5 bytes em vez de 8 para a parte não fracionária, e todas as três partes têm uma parte fracionária que requer de 0 a 3 bytes, dependendo da precisão dos segundos fracionários dos valores armazenados.

<table summary="Armazenamento necessário para precisão de frações de segundo."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Precisão de frações de segundo</th> <th>Armazenamento necessário</th> </tr></thead><tbody><tr> <td>0</td> <td>0 bytes</td> </tr><tr> <td>1, 2</td> <td>1 byte</td> </tr><tr> <td>3, 4</td> <td>2 bytes</td> </tr><tr> <td>5, 6</td> <td>3 bytes</td> </tr></tbody></table>

Por exemplo, `TIME(0)`, `TIME(2)`, `TIME(4)` e `TIME(6)` usam, respectivamente, 3, 4, 5 e 6 bytes. `TIME` e `TIME(0)` são equivalentes e exigem o mesmo armazenamento.

Para obter detalhes sobre a representação interna de valores temporais, consulte MySQL Internals: Algoritmos e Estruturas Importantes.

### Requisitos de armazenamento do tipo de corda

Na tabela a seguir, *`M`* representa o comprimento declarado da coluna em caracteres para tipos de string não binários e bytes para tipos de string binários. *`L`* representa o comprimento real em bytes de um valor de string dado.

<table summary="Armazenamento necessário para tipos de string."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Tipo de dados</th> <th>Armazenamento necessário</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>L</code>]</em>)</code></td> <td>A família compacta de formatos de linha do InnoDB otimiza o armazenamento para conjuntos de caracteres de comprimento variável. VejaCaracterísticas de Armazenamento do Formato de Linha COMPACTCaso contrário,<em>[[PH_HTML_CODE_<code>L</code>]</em>×<em>[[PH_HTML_CODE_<code>TINYBLOB</code>]</em>bytes, [[PH_HTML_CODE_<code>TINYTEXT</code>]</em>&lt;=</code>255, onde<em>[[PH_HTML_CODE_<code>L</code>]</em>é o número de bytes necessários para o caractere de maior comprimento no conjunto de caracteres.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>L</code>]</em>)</code></td> <td><em>[[PH_HTML_CODE_<code>BLOB</code>]</em>bytes, 0 [[PH_HTML_CODE_<code>TEXT</code>]</em>&lt;=</code>255</td> </tr><tr> <td>[[PH_HTML_CODE_<code>L</code>]</em>)</code>, [[PH_HTML_CODE_<code>L</code>]</em>)</code></td> <td><em>[[<code>L</code>]]</em>+ 1 byte se os valores da coluna exigirem 0 a 255 bytes,<em>[[<code>M</code><code>L</code>]</em>+ 2 bytes se os valores puderem exigir mais de 255 bytes</td> </tr><tr> <td>[[<code>TINYBLOB</code>]],[[<code>TINYTEXT</code>]]</td> <td><em>[[<code>L</code>]]</em>+ 1 byte, onde<em>[[<code>L</code>]]</em>&lt; 2<sup>8</sup></td> </tr><tr> <td>[[<code>BLOB</code>]],[[<code>TEXT</code>]]</td> <td><em>[[<code>L</code>]]</em>+ 2 bytes, onde<em>[[<code>L</code>]]</em>&lt; 2<sup>16</sup></td> </tr><tr> <td>[[<code>w</code><code>L</code>],[[<code>w</code><code>L</code>]</td> <td><em>[[<code>w</code><code>TINYBLOB</code>]</em>+ 3 bytes, onde<em>[[<code>w</code><code>TINYTEXT</code>]</em>&lt; 2<sup>24</sup></td> </tr><tr> <td>[[<code>w</code><code>L</code>],[[<code>w</code><code>L</code>]</td> <td><em>[[<code>w</code><code>BLOB</code>]</em>+ 4 bytes, onde<em>[[<code>w</code><code>TEXT</code>]</em>&lt; 2<sup>32</sup></td> </tr><tr> <td>[[<code>w</code><code>L</code>]</em>',<em>[[<code>w</code><code>L</code>]</em>",...)</code></td> <td>1 ou 2 bytes, dependendo do número de valores de enumeração (máximo de 65.535 valores)</td> </tr><tr> <td>[[<code>&lt;= <em><code>M</code><code>L</code>]</em>',<em>[[<code>&lt;= <em><code>M</code><code>L</code>]</em>",...)</code></td> <td>1, 2, 3, 4 ou 8 bytes, dependendo do número de membros do conjunto (máximo de 64 membros)</td> </tr></tbody></table>

Os tipos de strings de comprimento variável são armazenados usando um prefixo de comprimento mais os dados. O prefixo de comprimento requer de um a quatro bytes, dependendo do tipo de dado, e o valor do prefixo é *`L`* (o comprimento em bytes da string). Por exemplo, o armazenamento para um valor `MEDIUMTEXT` requer *`L`* bytes para armazenar o valor mais três bytes para armazenar o comprimento do valor.

Para calcular o número de bytes usados para armazenar um valor específico de uma coluna `CHAR`, `VARCHAR` ou `TEXT`, você deve levar em consideração o conjunto de caracteres usado para essa coluna e se o valor contém caracteres multibyte. Em particular, ao usar um conjunto de caracteres Unicode `utf8`, você deve ter em mente que nem todos os caracteres usam o mesmo número de bytes. Os conjuntos de caracteres `utf8mb3` e `utf8mb4` podem exigir até três e quatro bytes por caractere, respectivamente. Para uma análise detalhada do armazenamento usado para diferentes categorias de caracteres `utf8mb3` ou `utf8mb4`, consulte a Seção 10.9, “Suporte Unicode”.

Os tipos `VARCHAR`, `VARBINARY`, `BLOB` e `TEXT` são tipos de comprimento variável. Para cada um deles, os requisitos de armazenamento dependem desses fatores:

- O comprimento real do valor da coluna
- O comprimento máximo possível da coluna
- O conjunto de caracteres usado para a coluna, pois alguns conjuntos de caracteres contêm caracteres multibyte

Por exemplo, uma coluna `VARCHAR(255)` pode armazenar uma string com um comprimento máximo de 255 caracteres. Supondo que a coluna use o conjunto de caracteres `latin1` (um byte por caractere), o armazenamento real necessário é o comprimento da string (*`L`*), mais um byte para registrar o comprimento da string. Para a string `'abcd'`, *`L`* é 4 e o requisito de armazenamento é de cinco bytes. Se a mesma coluna for declarada para usar o conjunto de caracteres `ucs2` de duplo byte, o requisito de armazenamento é de 10 bytes: o comprimento de `'abcd'` é de oito bytes e a coluna requer dois bytes para armazenar os comprimentos porque o comprimento máximo é maior que 255 (até 510 bytes).

O número máximo efetivo de *bytes* que pode ser armazenado em uma coluna `VARCHAR` ou `VARBINARY` está sujeito ao tamanho máximo da linha de 65.535 bytes, que é compartilhado entre todas as colunas. Para uma coluna `VARCHAR` que armazena caracteres multibyte, o número máximo efetivo de *caracteres* é menor. Por exemplo, os caracteres `utf8mb3` podem exigir até três bytes por caractere, então uma coluna `VARCHAR` que usa o conjunto de caracteres `utf8mb3` pode ser declarada como um máximo de 21.844 caracteres. Veja a Seção 8.4.7, “Limites de Contagem de Colunas de Tabela e Tamanho da Linha”.

O `InnoDB` codifica campos de comprimento fixo maior ou igual a 768 bytes como campos de comprimento variável, que podem ser armazenados fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

O mecanismo de armazenamento `NDB` suporta colunas de largura variável. Isso significa que uma coluna `VARCHAR` em uma tabela do NDB Cluster requer a mesma quantidade de armazenamento que qualquer outro mecanismo de armazenamento, com a exceção de que esses valores estão alinhados em 4 bytes. Assim, a string `'abcd'` armazenada em uma coluna `VARCHAR(50)` usando o conjunto de caracteres `latin1` requer 8 bytes (em vez de 5 bytes para o mesmo valor da coluna em uma tabela `MyISAM`).

As colunas `TEXT`, `BLOB` e `JSON` são implementadas de maneira diferente no motor de armazenamento `NDB`, onde cada linha da coluna é composta por duas partes separadas. Uma dessas partes tem tamanho fixo (256 bytes para `TEXT` e `BLOB`, 4000 bytes para `JSON`) e é armazenada na tabela original. A outra parte consiste em quaisquer dados que excedam 256 bytes, que são armazenados em uma tabela de partes de blob oculta. O tamanho das linhas nesta segunda tabela é determinado pelo tipo exato da coluna, conforme mostrado na tabela a seguir:

<table summary="Comprimento das linhas da tabela blob do NDB para os tipos TEXT e BLOB."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Tipo</th> <th>Tamanho da parte do blob</th> </tr></thead><tbody><tr> <td>[[<code>BLOB</code>]],[[<code>TEXT</code>]]</td> <td>2000</td> </tr><tr> <td>[[<code>MEDIUMBLOB</code>]],[[<code>MEDIUMTEXT</code>]]</td> <td>4000</td> </tr><tr> <td>[[<code>LONGBLOB</code>]],[[<code>LONGTEXT</code>]]</td> <td>13948</td> </tr><tr> <td>[[<code>JSON</code>]]</td> <td>8100</td> </tr></tbody></table>

Isso significa que o tamanho de uma coluna `TEXT` é de 256 se *`size`* <= 256 (onde *`size`* representa o tamanho da linha); caso contrário, o tamanho é de 256 + *`size`* + (2000 × (*`size`* − 256) % 2000).

Nenhuma parte do blob é armazenada separadamente pelo `NDB` para valores de colunas `TINYBLOB` ou `TINYTEXT`.

Você pode aumentar o tamanho da parte blob de uma coluna `NDB` blob para o máximo de 13948 usando `NDB_COLUMN` em um comentário de coluna ao criar ou alterar a tabela pai. Consulte Opções de NDB_COLUMN para obter mais informações.

O tamanho de um objeto `ENUM` é determinado pelo número de valores de enumeração diferentes. Um byte é usado para enumerações com até 255 valores possíveis. Dois bytes são usados para enumerações com entre 256 e 65.535 valores possíveis. Veja a Seção 11.3.5, “O Tipo ENUM”.

O tamanho de um objeto `SET` é determinado pelo número de membros diferentes do conjunto. Se o tamanho do conjunto for *`N`*, o objeto ocupa `(N+7)/8` bytes, arredondado para cima para 1, 2, 3, 4 ou 8 bytes. Um `SET` pode ter um máximo de 64 membros. Veja a Seção 11.3.6, “O Tipo SET”.

### Requisitos de Armazenamento de Tipo Espacial

O MySQL armazena valores de geometria usando 4 bytes para indicar o SRID seguido da representação WKB do valor. A função `LENGTH()` retorna o espaço em bytes necessário para o armazenamento do valor.

Para descrições do WKB e dos formatos de armazenamento interno para valores espaciais, consulte a Seção 11.4.3, “Formatos de Dados Espaciais Compatíveis”.

### Requisitos de Armazenamento JSON

Em geral, o requisito de armazenamento para uma coluna `JSON` é aproximadamente o mesmo que para uma coluna `LONGBLOB` ou `LONGTEXT`; ou seja, o espaço consumido por um documento JSON é aproximadamente o mesmo que seria para a representação de string do documento armazenado em uma coluna de um desses tipos. No entanto, há um custo adicional imposto pela codificação binária, incluindo metadados e dicionários necessários para a busca, dos valores individuais armazenados no documento JSON. Por exemplo, uma string armazenada em um documento JSON requer de 4 a 10 bytes de armazenamento adicional, dependendo do comprimento da string e do tamanho do objeto ou array em que ela é armazenada.

Além disso, o MySQL impõe um limite ao tamanho de qualquer documento JSON armazenado em uma coluna `JSON`, de modo que ele não pode ser maior que o valor de `max_allowed_packet`.
