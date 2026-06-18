## 11.7 Requisitos de Armazenamento de Tipos de Dados

* Requisitos de Armazenamento de Tabela InnoDB
* Requisitos de Armazenamento de Tabela NDB
* Requisitos de Armazenamento de Tipos Numéricos
* Requisitos de Armazenamento de Tipos de Data e Hora
* Requisitos de Armazenamento de Tipos de String
* Requisitos de Armazenamento de Tipos Espaciais
* Requisitos de Armazenamento JSON

Os requisitos de armazenamento para dados de tabela em disco dependem de vários fatores. Diferentes *storage engines* representam tipos de dados e armazenam dados brutos de maneiras distintas. Os dados da tabela podem ser compactados, seja para uma coluna ou para uma linha inteira, o que complica o cálculo dos requisitos de armazenamento para uma tabela ou coluna.

Apesar das diferenças no layout de armazenamento em disco, as APIs internas do MySQL que comunicam e trocam informações sobre linhas de tabela utilizam uma estrutura de dados consistente que se aplica a todos os *storage engines*.

Esta seção inclui diretrizes e informações sobre os requisitos de armazenamento para cada tipo de dado suportado pelo MySQL, incluindo o formato interno e o tamanho para *storage engines* que usam uma representação de tamanho fixo para tipos de dados. As informações são listadas por categoria ou *storage engine*.

A representação interna de uma tabela possui um tamanho máximo de linha de 65.535 bytes, mesmo que o *storage engine* seja capaz de suportar linhas maiores. Este valor exclui colunas `BLOB` ou `TEXT`, que contribuem apenas com 9 a 12 bytes para este tamanho. Para dados `BLOB` e `TEXT`, a informação é armazenada internamente em uma área de memória diferente do *row buffer*. Diferentes *storage engines* lidam com a alocação e o armazenamento desses dados de maneiras distintas, de acordo com o método que utilizam para lidar com os tipos correspondentes. Para mais informações, consulte o Capítulo 15, *Alternative Storage Engines*, e a Seção 8.4.7, “Limits on Table Column Count and Row Size”.

### Requisitos de Armazenamento de Tabela InnoDB

Consulte a Seção 14.11, “InnoDB Row Formats” para obter informações sobre os requisitos de armazenamento para tabelas `InnoDB`.

### Requisitos de Armazenamento de Tabela NDB

Importante

Tabelas `NDB` usam alinhamento de 4 bytes; todo o armazenamento de dados `NDB` é feito em múltiplos de 4 bytes. Assim, um valor de coluna que normalmente ocuparia 15 bytes requer 16 bytes em uma tabela `NDB`. Por exemplo, em tabelas `NDB`, os tipos de coluna `TINYINT`, `SMALLINT`, `MEDIUMINT` e `INTEGER` (`INT`) exigem 4 bytes de armazenamento por registro devido ao fator de alinhamento.

Cada coluna `BIT(M)` ocupa *`M`* bits de espaço de armazenamento. Embora uma coluna `BIT` individual *não* seja alinhada em 4 bytes, o `NDB` reserva 4 bytes (32 bits) por linha para os primeiros 1-32 bits necessários para colunas `BIT`, depois mais 4 bytes para os bits 33-64, e assim por diante.

Embora um `NULL` por si só não exija espaço de armazenamento, o `NDB` reserva 4 bytes por linha se a definição da tabela contiver quaisquer colunas definidas como `NULL`, até 32 colunas `NULL`. (Se uma tabela NDB Cluster for definida com mais de 32 colunas `NULL` até 64 colunas `NULL`, 8 bytes por linha serão reservados.)

Toda tabela que utiliza o *storage engine* `NDB` requer uma Primary Key; se você não definir uma Primary Key, uma Primary Key “oculta” será criada pelo `NDB`. Esta Primary Key oculta consome 31-35 bytes por registro de tabela.

Você pode usar o script Perl **ndb_size.pl** para estimar os requisitos de armazenamento do `NDB`. Ele se conecta a um Database MySQL atual (não NDB Cluster) e cria um relatório sobre quanto espaço esse Database exigiria se usasse o *storage engine* `NDB`. Para mais informações, consulte a Seção 21.5.28, “ndb_size.pl — NDBCLUSTER Size Requirement Estimator”.

### Requisitos de Armazenamento de Tipos Numéricos

<table summary="Armazenamento necessário para tipos de dados numéricos."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Tipo de Dado</th> <th>Armazenamento Necessário</th> </tr></thead><tbody><tr> <td><code>TINYINT</code></td> <td>1 byte</td> </tr><tr> <td><code>SMALLINT</code></td> <td>2 bytes</td> </tr><tr> <td><code>MEDIUMINT</code></td> <td>3 bytes</td> </tr><tr> <td><code>INT</code>, <code>INTEGER</code></td> <td>4 bytes</td> </tr><tr> <td><code>BIGINT</code></td> <td>8 bytes</td> </tr><tr> <td><code>FLOAT(<em><code>p</code></em>)</code></td> <td>4 bytes se 0 &lt;= <em><code>p</code></em> &lt;= 24, 8 bytes se 25 &lt;= <em><code>p</code></em> &lt;= 53</td> </tr><tr> <td><code>FLOAT</code></td> <td>4 bytes</td> </tr><tr> <td><code>DOUBLE [PRECISION]</code>, <code>REAL</code></td> <td>8 bytes</td> </tr><tr> <td><code>DECIMAL(<em><code>M</code></em>,<em><code>D</code></em>)</code>, <code>NUMERIC(<em><code>M</code></em>,<em><code>D</code></em>)</code></td> <td>Varia; veja a discussão a seguir</td> </tr><tr> <td><code>BIT(<em><code>M</code></em>)</code></td> <td>aproximadamente (<em><code>M</code></em>+7)/8 bytes</td> </tr> </tbody></table>

Os valores para colunas `DECIMAL` (e `NUMERIC`) são representados usando um formato binário que compacta nove dígitos decimais (base 10) em quatro bytes. O armazenamento para as partes inteiras e fracionárias de cada valor é determinado separadamente. Cada múltiplo de nove dígitos requer quatro bytes, e os dígitos “restantes” requerem uma fração de quatro bytes. O armazenamento necessário para os dígitos excedentes é fornecido pela seguinte tabela.

<table summary="Armazenamento necessário por dígitos excedentes/restantes em valores DECIMAL."><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Dígitos Restantes</th> <th>Número de Bytes</th> </tr></thead><tbody><tr> <td>0</td> <td>0</td> </tr><tr> <td>1</td> <td>1</td> </tr><tr> <td>2</td> <td>1</td> </tr><tr> <td>3</td> <td>2</td> </tr><tr> <td>4</td> <td>2</td> </tr><tr> <td>5</td> <td>3</td> </tr><tr> <td>6</td> <td>3</td> </tr><tr> <td>7</td> <td>4</td> </tr><tr> <td>8</td> <td>4</td> </tr> </tbody></table>

### Requisitos de Armazenamento de Tipos de Data e Hora

Para colunas `TIME`, `DATETIME` e `TIMESTAMP`, o armazenamento necessário para tabelas criadas antes do MySQL 5.6.4 difere das tabelas criadas a partir do 5.6.4. Isso se deve a uma mudança no 5.6.4 que permite que esses tipos tenham uma parte fracionária, que requer de 0 a 3 bytes.

<table summary="Armazenamento necessário para tipos de dados de data e hora antes do MySQL 5.6.4 e a partir do MySQL 5.6.4."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Tipo de Dado</th> <th>Armazenamento Necessário Antes do MySQL 5.6.4</th> <th>Armazenamento Necessário a Partir do MySQL 5.6.4</th> </tr></thead><tbody><tr> <th><code>YEAR</code></th> <td>1 byte</td> <td>1 byte</td> </tr><tr> <th><code>DATE</code></th> <td>3 bytes</td> <td>3 bytes</td> </tr><tr> <th><code>TIME</code></th> <td>3 bytes</td> <td>3 bytes + armazenamento de segundos fracionários</td> </tr><tr> <th><code>DATETIME</code></th> <td>8 bytes</td> <td>5 bytes + armazenamento de segundos fracionários</td> </tr><tr> <th><code>TIMESTAMP</code></th> <td>4 bytes</td> <td>4 bytes + armazenamento de segundos fracionários</td> </tr> </tbody></table>

A partir do MySQL 5.6.4, o armazenamento para `YEAR` e `DATE` permanece inalterado. No entanto, `TIME`, `DATETIME` e `TIMESTAMP` são representados de forma diferente. `DATETIME` é compactado de forma mais eficiente, exigindo 5 em vez de 8 bytes para a parte não fracionária, e as três partes têm uma parte fracionária que requer de 0 a 3 bytes, dependendo da precisão dos segundos fracionários dos valores armazenados.

<table summary="Armazenamento necessário para precisão de segundos fracionários."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Precisão dos Segundos Fracionários</th> <th>Armazenamento Necessário</th> </tr></thead><tbody><tr> <td>0</td> <td>0 bytes</td> </tr><tr> <td>1, 2</td> <td>1 byte</td> </tr><tr> <td>3, 4</td> <td>2 bytes</td> </tr><tr> <td>5, 6</td> <td>3 bytes</td> </tr> </tbody></table>

Por exemplo, `TIME(0)`, `TIME(2)`, `TIME(4)` e `TIME(6)` usam 3, 4, 5 e 6 bytes, respectivamente. `TIME` e `TIME(0)` são equivalentes e requerem o mesmo armazenamento.

Para detalhes sobre a representação interna de valores temporais, consulte MySQL Internals: Important Algorithms and Structures.

### Requisitos de Armazenamento de Tipos de String

Na tabela a seguir, *`M`* representa o comprimento da coluna declarado em caracteres para tipos de string não binários e em bytes para tipos de string binários. *`L`* representa o comprimento real em bytes de um determinado valor de string.

<table summary="Armazenamento necessário para tipos de string."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Tipo de Dado</th> <th>Armazenamento Necessário</th> </tr></thead><tbody><tr> <td><code>CHAR(<em><code>M</code></em>)</code></td> <td>A família compacta de formatos de linha do InnoDB otimiza o armazenamento para conjuntos de caracteres de comprimento variável. Consulte COMPACT Row Format Storage Characteristics. Caso contrário, <em><code>M</code></em> × <em><code>w</code></em> bytes, <code>&lt;= <em><code>M</code></em> &lt;=</code> 255, onde <em><code>w</code></em> é o número de bytes necessários para o caractere de comprimento máximo no conjunto de caracteres.</td> </tr><tr> <td><code>BINARY(<em><code>M</code></em>)</code></td> <td><em><code>M</code></em> bytes, 0 <code>&lt;= <em><code>M</code></em> &lt;=</code> 255</td> </tr><tr> <td><code>VARCHAR(<em><code>M</code></em>)</code>, <code>VARBINARY(<em><code>M</code></em>)</code></td> <td><em><code>L</code></em> + 1 bytes se os valores da coluna exigirem 0 − 255 bytes, <em><code>L</code></em> + 2 bytes se os valores puderem exigir mais de 255 bytes</td> </tr><tr> <td><code>TINYBLOB</code>, <code>TINYTEXT</code></td> <td><em><code>L</code></em> + 1 bytes, onde <em><code>L</code></em> &lt; 2<sup>8</sup></td> </tr><tr> <td><code>BLOB</code>, <code>TEXT</code></td> <td><em><code>L</code></em> + 2 bytes, onde <em><code>L</code></em> &lt; 2<sup>16</sup></td> </tr><tr> <td><code>MEDIUMBLOB</code>, <code>MEDIUMTEXT</code></td> <td><em><code>L</code></em> + 3 bytes, onde <em><code>L</code></em> &lt; 2<sup>24</sup></td> </tr><tr> <td><code>LONGBLOB</code>, <code>LONGTEXT</code></td> <td><em><code>L</code></em> + 4 bytes, onde <em><code>L</code></em> &lt; 2<sup>32</sup></td> </tr><tr> <td><code>ENUM('<em><code>value1</code></em>','<em><code>value2</code></em>',...)</code></td> <td>1 ou 2 bytes, dependendo do número de valores de enumeração (máximo de 65.535 valores)</td> </tr><tr> <td><code>SET('<em><code>value1</code></em>','<em><code>value2</code></em>',...)</code></td> <td>1, 2, 3, 4, ou 8 bytes, dependendo do número de membros do set (máximo de 64 membros)</td> </tr> </tbody></table>

Os tipos de string de comprimento variável são armazenados usando um prefixo de comprimento mais os dados. O prefixo de comprimento requer de um a quatro bytes, dependendo do tipo de dado, e o valor do prefixo é *`L`* (o comprimento da string em bytes). Por exemplo, o armazenamento para um valor `MEDIUMTEXT` requer *`L`* bytes para armazenar o valor mais três bytes para armazenar o comprimento do valor.

Para calcular o número de bytes usados para armazenar um valor de coluna `CHAR`, `VARCHAR` ou `TEXT` específico, você deve levar em consideração o conjunto de caracteres usado para essa coluna e se o valor contém caracteres multibyte. Em particular, ao usar um conjunto de caracteres Unicode `utf8`, você deve ter em mente que nem todos os caracteres usam o mesmo número de bytes. Os conjuntos de caracteres `utf8mb3` e `utf8mb4` podem exigir até três e quatro bytes por caractere, respectivamente. Para uma análise detalhada do armazenamento usado para diferentes categorias de caracteres `utf8mb3` ou `utf8mb4`, consulte a Seção 10.9, “Unicode Support”.

`VARCHAR`, `VARBINARY` e os tipos `BLOB` e `TEXT` são tipos de comprimento variável. Para cada um, os requisitos de armazenamento dependem destes fatores:

* O comprimento real do valor da coluna
* O comprimento máximo possível da coluna
* O conjunto de caracteres usado para a coluna, pois alguns conjuntos de caracteres contêm caracteres multibyte

Por exemplo, uma coluna `VARCHAR(255)` pode conter uma string com um comprimento máximo de 255 caracteres. Supondo que a coluna use o conjunto de caracteres `latin1` (um byte por caractere), o armazenamento real exigido é o comprimento da string (*`L`*), mais um byte para registrar o comprimento da string. Para a string `'abcd'`, *`L`* é 4 e o requisito de armazenamento é de cinco bytes. Se a mesma coluna for declarada para usar o conjunto de caracteres double-byte `ucs2`, o requisito de armazenamento é de 10 bytes: O comprimento de `'abcd'` é de oito bytes e a coluna requer dois bytes para armazenar os comprimentos porque o comprimento máximo é maior que 255 (até 510 bytes).

O número máximo efetivo de *bytes* que pode ser armazenado em uma coluna `VARCHAR` ou `VARBINARY` está sujeito ao tamanho máximo de linha de 65.535 bytes, que é compartilhado entre todas as colunas. Para uma coluna `VARCHAR` que armazena caracteres multibyte, o número máximo efetivo de *caracteres* é menor. Por exemplo, os caracteres `utf8mb3` podem exigir até três bytes por caractere, portanto, uma coluna `VARCHAR` que usa o conjunto de caracteres `utf8mb3` pode ser declarada com um máximo de 21.844 caracteres. Consulte a Seção 8.4.7, “Limits on Table Column Count and Row Size”.

O `InnoDB` codifica campos de comprimento fixo maiores ou iguais a 768 bytes como campos de comprimento variável, que podem ser armazenados fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de bytes do conjunto de caracteres for maior que 3, como é o caso do `utf8mb4`.

O *storage engine* `NDB` suporta colunas de largura variável. Isso significa que uma coluna `VARCHAR` em uma tabela NDB Cluster requer a mesma quantidade de armazenamento que qualquer outro *storage engine*, com a exceção de que esses valores são alinhados em 4 bytes. Assim, a string `'abcd'` armazenada em uma coluna `VARCHAR(50)` usando o conjunto de caracteres `latin1` requer 8 bytes (em vez de 5 bytes para o mesmo valor de coluna em uma tabela `MyISAM`).

As colunas `TEXT`, `BLOB` e `JSON` são implementadas de forma diferente no *storage engine* `NDB`, onde cada linha na coluna é composta por duas partes separadas. Uma delas tem tamanho fixo (256 bytes para `TEXT` e `BLOB`, 4000 bytes para `JSON`) e é de fato armazenada na tabela original. A outra consiste em quaisquer dados em excesso de 256 bytes, que são armazenados em uma tabela oculta de partes blob (*blob parts table*). O tamanho das linhas nesta segunda tabela é determinado pelo tipo exato da coluna, conforme mostrado na seguinte tabela:

<table summary="Comprimentos de linha da tabela blob NDB para tipos TEXT e BLOB."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Tipo</th> <th>Tamanho da Parte Blob</th> </tr></thead><tbody><tr> <td><code>BLOB</code>, <code>TEXT</code></td> <td>2000</td> </tr><tr> <td><code>MEDIUMBLOB</code>, <code>MEDIUMTEXT</code></td> <td>4000</td> </tr><tr> <td><code>LONGBLOB</code>, <code>LONGTEXT</code></td> <td>13948</td> </tr><tr> <td><code>JSON</code></td> <td>8100</td> </tr> </tbody></table>

Isso significa que o tamanho de uma coluna `TEXT` é 256 se *`size`* <= 256 (onde *`size`* representa o tamanho da linha); caso contrário, o tamanho é 256 + *`size`* + (2000 × (*`size`* − 256) % 2000).

Nenhuma parte blob é armazenada separadamente pelo `NDB` para valores de coluna `TINYBLOB` ou `TINYTEXT`.

Você pode aumentar o tamanho da parte blob de uma coluna blob `NDB` para o máximo de 13948 usando `NDB_COLUMN` em um comentário de coluna ao criar ou alterar a tabela pai. Consulte NDB_COLUMN Options para obter mais informações.

O tamanho de um objeto `ENUM` é determinado pelo número de diferentes valores de enumeração. Um byte é usado para enumerações com até 255 valores possíveis. Dois bytes são usados para enumerações com entre 256 e 65.535 valores possíveis. Consulte a Seção 11.3.5, “The ENUM Type”.

O tamanho de um objeto `SET` é determinado pelo número de diferentes membros do set. Se o tamanho do set for *`N`*, o objeto ocupa `(N+7)/8` bytes, arredondado para 1, 2, 3, 4 ou 8 bytes. Um `SET` pode ter um máximo de 64 membros. Consulte a Seção 11.3.6, “The SET Type”.

### Requisitos de Armazenamento de Tipos Espaciais

O MySQL armazena valores de geometria usando 4 bytes para indicar o SRID seguido pela representação WKB do valor. A função `LENGTH()` retorna o espaço em bytes necessário para o armazenamento do valor.

Para descrições de WKB e formatos de armazenamento internos para valores espaciais, consulte a Seção 11.4.3, “Supported Spatial Data Formats”.

### Requisitos de Armazenamento JSON

Em geral, o requisito de armazenamento para uma coluna `JSON` é aproximadamente o mesmo que para uma coluna `LONGBLOB` ou `LONGTEXT`; ou seja, o espaço consumido por um documento JSON é praticamente o mesmo que seria para a representação de string do documento armazenada em uma coluna de um desses tipos. No entanto, há uma sobrecarga imposta pela codificação binária, incluindo metadata e dicionários necessários para a pesquisa (*lookup*), dos valores individuais armazenados no documento JSON. Por exemplo, uma string armazenada em um documento JSON requer de 4 a 10 bytes de armazenamento adicional, dependendo do comprimento da string e do tamanho do objeto ou array no qual ela está armazenada.

Além disso, o MySQL impõe um limite ao tamanho de qualquer documento JSON armazenado em uma coluna `JSON`, de modo que ele não pode ser maior do que o valor de `max_allowed_packet`.