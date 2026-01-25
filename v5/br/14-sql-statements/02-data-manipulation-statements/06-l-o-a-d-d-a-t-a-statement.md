### 13.2.6 LOAD DATA Statement

```sql
LOAD DATA
    [LOW_PRIORITY | CONCURRENT] [LOCAL]
    INFILE 'file_name'
    [REPLACE | IGNORE]
    INTO TABLE tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [CHARACTER SET charset_name]
    [{FIELDS | COLUMNS}
        [TERMINATED BY 'string']
        OPTIONALLY] ENCLOSED BY 'char']
        [ESCAPED BY 'char']
    ]
    [LINES
        [STARTING BY 'string']
        [TERMINATED BY 'string']
    ]
    [IGNORE number {LINES | ROWS}]
    [(col_name_or_user_var
        [, col_name_or_user_var] ...)]
    [SET col_name={expr | DEFAULT}
        [, col_name={expr | DEFAULT}] ...]
```

O statement [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") lê linhas de um arquivo de texto para uma tabela em uma velocidade muito alta. O arquivo pode ser lido do host do server ou do host do client, dependendo se o modificador `LOCAL` é fornecido. `LOCAL` também afeta a interpretação de dados e o tratamento de erros.

[`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") é o complemento de [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement"). (Consulte a [Seção 13.2.9.1, “SELECT ... INTO Statement”](select-into.html "13.2.9.1 SELECT ... INTO Statement").) Para escrever dados de uma tabela em um arquivo, use [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement"). Para ler o arquivo de volta para uma tabela, use [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"). A sintaxe das cláusulas `FIELDS` e `LINES` é a mesma para ambos os statements.

O utilitário [**mysqlimport**](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program") fornece outra maneira de carregar arquivos de dados; ele opera enviando um statement [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") para o server. Consulte a [Seção 4.5.5, “mysqlimport — Um Programa de Importação de Dados”](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program").

Para obter informações sobre a eficiência de [`INSERT`](insert.html "13.2.5 INSERT Statement") versus [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") e como acelerar o [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), consulte a [Seção 8.2.4.1, “Otimizando Statements INSERT”](insert-optimization.html "8.2.4.1 Optimizing INSERT Statements").

* [Operação Non-LOCAL Versus LOCAL](load-data.html#load-data-local "Non-LOCAL Versus LOCAL Operation")
* [Character Set do Arquivo de Entrada](load-data.html#load-data-character-set "Input File Character Set")
* [Localização do Arquivo de Entrada](load-data.html#load-data-file-location "Input File Location")
* [Requisitos de Segurança](load-data.html#load-data-security-requirements "Security Requirements")
* [Tratamento de Chaves Duplicadas e Erros](load-data.html#load-data-error-handling "Duplicate-Key and Error Handling")
* [Tratamento de Index](load-data.html#load-data-index-handling "Index Handling")
* [Tratamento de Field e Line](load-data.html#load-data-field-line-handling "Field and Line Handling")
* [Especificação da Lista de Colunas](load-data.html#load-data-column-list "Column List Specification")
* [Pré-processamento de Entrada](load-data.html#load-data-input-preprocessing "Input Preprocessing")
* [Atribuição de Valores de Colunas](load-data.html#load-data-column-assignments "Column Value Assignment")
* [Suporte a Tabelas Particionadas](load-data.html#load-data-partitioning-support "Partitioned Table Support")
* [Considerações sobre Concorrência](load-data.html#load-data-concurrency "Concurrency Considerations")
* [Informações de Resultado do Statement](load-data.html#load-data-statement-result-information "Statement Result Information")
* [Considerações sobre Replicação](load-data.html#load-data-replication "Replication Considerations")
* [Tópicos Diversos](load-data.html#load-data-miscellaneous "Miscellaneous Topics")

#### Operação Non-LOCAL Versus LOCAL

O modificador `LOCAL` afeta estes aspectos do [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), em comparação com a operação non-`LOCAL`:

* Ele altera a localização esperada do arquivo de entrada; consulte [Localização do Arquivo de Entrada](load-data.html#load-data-file-location "Input File Location").

* Ele altera os requisitos de segurança do statement; consulte [Requisitos de Segurança](load-data.html#load-data-security-requirements "Security Requirements").

* A menos que `REPLACE` também seja especificado, `LOCAL` tem o mesmo efeito que o modificador `IGNORE` na interpretação do conteúdo do arquivo de entrada e no tratamento de erros; consulte [Tratamento de Chaves Duplicadas e Erros](load-data.html#load-data-error-handling "Duplicate-Key and Error Handling") e [Atribuição de Valores de Colunas](load-data.html#load-data-column-assignments "Column Value Assignment").

`LOCAL` funciona apenas se o server e seu client tiverem sido configurados para permiti-lo. Por exemplo, se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi iniciado com a variável de sistema [`local_infile`](server-system-variables.html#sysvar_local_infile) desabilitada, `LOCAL` produz um erro. Consulte a [Seção 6.1.6, “Security Considerations for LOAD DATA LOCAL”](load-data-local-security.html "6.1.6 Security Considerations for LOAD DATA LOCAL").

#### Character Set do Arquivo de Entrada

O nome do arquivo deve ser fornecido como uma string literal. No Windows, especifique barras invertidas em nomes de path como barras normais ou barras invertidas duplicadas. O server interpreta o nome do arquivo usando o character set indicado pela variável de sistema [`character_set_filesystem`](server-system-variables.html#sysvar_character_set_filesystem).

Por padrão, o server interpreta o conteúdo do arquivo usando o character set indicado pela variável de sistema [`character_set_database`](server-system-variables.html#sysvar_character_set_database). Se o conteúdo do arquivo usar um character set diferente desse padrão, é recomendável especificar esse character set usando a cláusula `CHARACTER SET`. Um character set de `binary` especifica "sem conversão".

[`SET NAMES`](set-names.html "13.7.4.3 SET NAMES Statement") e a configuração de [`character_set_client`](server-system-variables.html#sysvar_character_set_client) não afetam a interpretação do conteúdo do arquivo.

[`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") interpreta todos os fields no arquivo como tendo o mesmo character set, independentemente dos data types das colunas para as quais os valores de field são carregados. Para uma interpretação adequada do arquivo, você deve garantir que ele foi escrito com o character set correto. Por exemplo, se você escrever um arquivo de dados com [**mysqldump -T**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") ou emitindo um statement [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") no [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), certifique-se de usar uma opção [`--default-character-set`](mysql-command-options.html#option_mysql_default-character-set) para escrever a saída no character set a ser usado quando o arquivo for carregado com [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

Nota

Não é possível carregar arquivos de dados que usem o character set `ucs2`, `utf16`, `utf16le` ou `utf32`.

#### Localização do Arquivo de Entrada

Estas regras determinam a localização do arquivo de entrada para o [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"):

* Se `LOCAL` não for especificado, o arquivo deve estar localizado no host do server. O server lê o arquivo diretamente, localizando-o da seguinte forma:

  + Se o nome do arquivo for um path name absoluto, o server o usa conforme fornecido.

  + Se o nome do arquivo for um path name relativo com componentes iniciais, o server procura o arquivo em relação ao seu `data directory`.

  + Se o nome do arquivo não tiver componentes iniciais, o server procura o arquivo no `database directory` do default database.

* Se `LOCAL` for especificado, o arquivo deve estar localizado no client host. O client program lê o arquivo, localizando-o da seguinte forma:

  + Se o nome do arquivo for um path name absoluto, o client program o usa conforme fornecido.

  + Se o nome do arquivo for um path name relativo, o client program procura o arquivo em relação ao seu `invocation directory`.

  Quando `LOCAL` é usado, o client program lê o arquivo e envia seu conteúdo para o server. O server cria uma cópia do arquivo no diretório onde armazena arquivos temporários. Consulte a [Seção B.3.3.5, “Onde o MySQL Armazena Arquivos Temporários”](temporary-files.html "B.3.3.5 Where MySQL Stores Temporary Files"). A falta de espaço suficiente para a cópia neste diretório pode fazer com que o statement [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") falhe.

As regras non-`LOCAL` significam que o server lê um arquivo nomeado como `./myfile.txt` em relação ao seu `data directory`, enquanto ele lê um arquivo nomeado como `myfile.txt` do `database directory` do default database. Por exemplo, se o statement [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") a seguir for executado enquanto `db1` for o default database, o server lê o arquivo `data.txt` do `database directory` para `db1`, embora o statement carregue explicitamente o arquivo em uma tabela no `database` `db2`:

```sql
LOAD DATA INFILE 'data.txt' INTO TABLE db2.my_table;
```

#### Requisitos de Segurança

Para uma operação de carregamento non-`LOCAL`, o server lê um arquivo de texto localizado no server host, portanto, estes requisitos de segurança devem ser satisfeitos:

* Você deve ter o privilégio [`FILE`](privileges-provided.html#priv_file). Consulte a [Seção 6.2.2, “Privilégios Fornecidos pelo MySQL”](privileges-provided.html "6.2.2 Privileges Provided by MySQL").

* A operação está sujeita à configuração da variável de sistema [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv):

  + Se o valor da variável for um nome de diretório não vazio, o arquivo deve estar localizado nesse diretório.

  + Se o valor da variável estiver vazio (o que é inseguro), o arquivo precisa apenas ser legível pelo server.

Para uma operação de carregamento `LOCAL`, o client program lê um arquivo de texto localizado no client host. Como o conteúdo do arquivo é enviado pelo client ao server através da conexão, usar `LOCAL` é um pouco mais lento do que quando o server acessa o arquivo diretamente. Por outro lado, você não precisa do privilégio [`FILE`](privileges-provided.html#priv_file), e o arquivo pode estar localizado em qualquer diretório que o client program possa acessar.

#### Tratamento de Chaves Duplicadas e Erros

Os modificadores `REPLACE` e `IGNORE` controlam o tratamento de novas linhas (de entrada) que duplicam linhas de tabela existentes em valores de `unique key` (`PRIMARY KEY` ou valores de `UNIQUE index`):

* Com `REPLACE`, as novas linhas que têm o mesmo valor que um valor de `unique key` em uma linha existente substituem a linha existente. Consulte a [Seção 13.2.8, “REPLACE Statement”](replace.html "13.2.8 REPLACE Statement").

* Com `IGNORE`, as novas linhas que duplicam uma linha existente em um valor de `unique key` são descartadas. Para mais informações, consulte [O Efeito de IGNORE na Execução do Statement](sql-mode.html#ignore-effect-on-execution "The Effect of IGNORE on Statement Execution").

A menos que `REPLACE` também seja especificado, o modificador `LOCAL` tem o mesmo efeito que `IGNORE`. Isso ocorre porque o server não tem como interromper a transmissão do arquivo no meio da operação.

Se nenhum de `REPLACE`, `IGNORE` ou `LOCAL` for especificado, ocorrerá um erro quando um valor de chave duplicado for encontrado, e o restante do arquivo de texto será ignorado.

Além de afetar o tratamento de chaves duplicadas conforme descrito, `IGNORE` e `LOCAL` também afetam o tratamento de erros:

* Quando nem `IGNORE` nem `LOCAL` são especificados, erros de interpretação de dados encerram a operação.

* Quando `IGNORE`—ou `LOCAL` sem `REPLACE`—é especificado, erros de interpretação de dados se tornam warnings e a operação de carregamento continua, mesmo se o SQL mode for restritivo. Para exemplos, consulte [Atribuição de Valores de Colunas](load-data.html#load-data-column-assignments "Column Value Assignment").

#### Tratamento de Index

Para ignorar foreign key constraints durante a operação de carregamento, execute um statement `SET foreign_key_checks = 0` antes de executar [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

Se você usar [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") em uma tabela `MyISAM` vazia, todos os nonunique indexes são criados em um batch separado (como para [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement")). Normalmente, isso torna o [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") muito mais rápido quando você tem muitos indexes. Em alguns casos extremos, você pode criar os indexes ainda mais rápido desativando-os com [`ALTER TABLE ... DISABLE KEYS`](alter-table.html "13.1.8 ALTER TABLE Statement") antes de carregar o arquivo na tabela e recriando os indexes com [`ALTER TABLE ... ENABLE KEYS`](alter-table.html "13.1.8 ALTER TABLE Statement") após carregar o arquivo. Consulte a [Seção 8.2.4.1, “Otimizando Statements INSERT”](insert-optimization.html "8.2.4.1 Optimizing INSERT Statements").

#### Tratamento de Field e Line

Tanto para os statements [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") quanto para [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement"), a sintaxe das cláusulas `FIELDS` e `LINES` é a mesma. Ambas as cláusulas são opcionais, mas `FIELDS` deve preceder `LINES` se ambas forem especificadas.

Se você especificar uma cláusula `FIELDS`, cada uma de suas subcláusulas (`TERMINATED BY`, `[OPTIONALLY] ENCLOSED BY` e `ESCAPED BY`) também é opcional, exceto que você deve especificar pelo menos uma delas. Os argumentos para essas cláusulas são permitidos a conter apenas caracteres ASCII.

Se você não especificar nenhuma cláusula `FIELDS` ou `LINES`, os defaults são os mesmos como se você tivesse escrito isto:

```sql
FIELDS TERMINATED BY '\t' ENCLOSED BY '' ESCAPED BY '\\'
LINES TERMINATED BY '\n' STARTING BY ''
```

A barra invertida é o escape character do MySQL dentro de strings em statements SQL. Assim, para especificar uma barra invertida literal, você deve especificar duas barras invertidas para que o valor seja interpretado como uma única barra invertida. As escape sequences `'\t'` e `'\n'` especificam tab e newline characters, respectivamente.

Em outras palavras, os defaults fazem com que [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") atue da seguinte forma ao ler a entrada:

* Procura limites de linha em newlines.
* Não ignora nenhum prefixo de linha.
* Divide as linhas em fields em tabs.
* Não espera que os fields sejam envolvidos por quaisquer quoting characters.

* Interpreta caracteres precedidos pelo escape character `\` como escape sequences. Por exemplo, `\t`, `\n` e `\\` significam tab, newline e barra invertida, respectivamente. Consulte a discussão sobre `FIELDS ESCAPED BY` mais adiante para a lista completa de escape sequences.

Inversamente, os defaults fazem com que [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") atue da seguinte forma ao escrever a saída:

* Escreve tabs entre fields.
* Não envolve fields dentro de quaisquer quoting characters.
* Usa `\` para escapar instâncias de tab, newline ou `\` que ocorrem dentro de valores de field.

* Escreve newlines no final das linhas.

Nota

Para um arquivo de texto gerado em um sistema Windows, a leitura adequada do arquivo pode exigir `LINES TERMINATED BY '\r\n'` porque os programas Windows tipicamente usam dois caracteres como line terminator. Alguns programas, como o **WordPad**, podem usar `\r` como line terminator ao escrever arquivos. Para ler tais arquivos, use `LINES TERMINATED BY '\r'`.

Se todas as linhas de entrada tiverem um prefixo comum que você deseja ignorar, você pode usar `LINES STARTING BY 'prefix_string'` para pular o prefixo *e tudo o que vier antes dele*. Se uma linha não incluir o prefixo, a linha inteira será ignorada. Suponha que você emita o seguinte statement:

```sql
LOAD DATA INFILE '/tmp/test.txt' INTO TABLE test
  FIELDS TERMINATED BY ','  LINES STARTING BY 'xxx';
```

Se o arquivo de dados se parecer com isto:

```sql
xxx"abc",1
something xxx"def",2
"ghi",3
```

As linhas resultantes são `("abc",1)` e `("def",2)`. A terceira linha no arquivo é ignorada porque não contém o prefixo.

A cláusula `IGNORE number LINES` pode ser usada para ignorar linhas no início do arquivo. Por exemplo, você pode usar `IGNORE 1 LINES` para pular uma linha de cabeçalho inicial contendo nomes de colunas:

```sql
LOAD DATA INFILE '/tmp/test.txt' INTO TABLE test IGNORE 1 LINES;
```

Quando você usa [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") em conjunto com [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") para escrever dados de um database em um arquivo e, em seguida, ler o arquivo de volta para o database posteriormente, as opções de tratamento de field e line para ambos os statements devem corresponder. Caso contrário, [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") não interpreta o conteúdo do arquivo corretamente. Suponha que você use [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") para escrever um arquivo com fields delimitados por vírgulas:

```sql
SELECT * INTO OUTFILE 'data.txt'
  FIELDS TERMINATED BY ','
  FROM table2;
```

Para ler o arquivo delimitado por vírgulas, o statement correto é:

```sql
LOAD DATA INFILE 'data.txt' INTO TABLE table2
  FIELDS TERMINATED BY ',';
```

Se, em vez disso, você tentasse ler o arquivo com o statement mostrado a seguir, isso não funcionaria porque instrui [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") a procurar tabs entre fields:

```sql
LOAD DATA INFILE 'data.txt' INTO TABLE table2
  FIELDS TERMINATED BY '\t';
```

O resultado provável é que cada linha de entrada seria interpretada como um único field.

[`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") pode ser usado para ler arquivos obtidos de fontes externas. Por exemplo, muitos programas podem exportar dados no formato comma-separated values (CSV), de forma que as linhas tenham fields separados por vírgulas e envolvidos por aspas duplas, com uma linha inicial de nomes de colunas. Se as linhas em tal arquivo forem terminadas por pares de carriage return/newline, o statement mostrado aqui ilustra as opções de tratamento de field e line que você usaria para carregar o arquivo:

```sql
LOAD DATA INFILE 'data.txt' INTO TABLE tbl_name
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\r\n'
  IGNORE 1 LINES;
```

Se os valores de entrada não estiverem necessariamente envolvidos por aspas, use `OPTIONALLY` antes da opção `ENCLOSED BY`.

Qualquer uma das opções de tratamento de field ou line pode especificar uma string vazia (`''`). Se não estiver vazio, os valores de `FIELDS [OPTIONALLY] ENCLOSED BY` e `FIELDS ESCAPED BY` devem ser um único caractere. Os valores de `FIELDS TERMINATED BY`, `LINES STARTING BY` e `LINES TERMINATED BY` podem ter mais de um caractere. Por exemplo, para escrever linhas que são terminadas por pares de carriage return/linefeed, ou para ler um arquivo contendo tais linhas, especifique uma cláusula `LINES TERMINATED BY '\r\n'`.

Para ler um arquivo contendo piadas separadas por linhas consistindo de `%%`, você pode fazer isto:

```sql
CREATE TABLE jokes
  (a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  joke TEXT NOT NULL);
LOAD DATA INFILE '/tmp/jokes.txt' INTO TABLE jokes
  FIELDS TERMINATED BY ''
  LINES TERMINATED BY '\n%%\n' (joke);
```

`FIELDS [OPTIONALLY] ENCLOSED BY` controla o quoting de fields. Para saída ([`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement")), se você omitir a palavra `OPTIONALLY`, todos os fields são envolvidos pelo caractere `ENCLOSED BY`. Um exemplo de tal saída (usando uma vírgula como field delimiter) é mostrado aqui:

```sql
"1","a string","100.20"
"2","a string containing a , comma","102.20"
"3","a string containing a \" quote","102.20"
"4","a string containing a \", quote and comma","102.20"
```

Se você especificar `OPTIONALLY`, o caractere `ENCLOSED BY` é usado apenas para envolver valores de colunas que têm um data type de string (como [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`ENUM`](enum.html "11.3.5 The ENUM Type")):

```sql
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a \" quote",102.20
4,"a string containing a \", quote and comma",102.20
```

Ocorrências do caractere `ENCLOSED BY` dentro de um valor de field são escapadas prefixando-as com o caractere `ESCAPED BY`. Além disso, se você especificar um valor `ESCAPED BY` vazio, é possível gerar inadvertidamente uma saída que não pode ser lida corretamente por [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"). Por exemplo, a saída anterior mostrada apareceria da seguinte forma se o escape character estivesse vazio. Observe que o segundo field na quarta linha contém uma vírgula após a aspa, que (erroneamente) parece encerrar o field:

```sql
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a " quote",102.20
4,"a string containing a ", quote and comma",102.20
```

Para entrada, o caractere `ENCLOSED BY`, se presente, é removido das extremidades dos valores de field. (Isso é verdade independentemente de `OPTIONALLY` ser especificado; `OPTIONALLY` não tem efeito na interpretação da entrada.) Ocorrências do caractere `ENCLOSED BY` precedidas pelo caractere `ESCAPED BY` são interpretadas como parte do valor do field atual.

Se o field começar com o caractere `ENCLOSED BY`, as instâncias desse caractere são reconhecidas como encerrando um valor de field apenas se seguidas pela sequência `TERMINATED BY` de field ou linha. Para evitar ambiguidade, as ocorrências do caractere `ENCLOSED BY` dentro de um valor de field podem ser dobradas e são interpretadas como uma única instância do caractere. Por exemplo, se `ENCLOSED BY '"'` for especificado, as aspas são tratadas conforme mostrado aqui:

```sql
"The ""BIG"" boss"  -> The "BIG" boss
The "BIG" boss      -> The "BIG" boss
The ""BIG"" boss    -> The ""BIG"" boss
```

`FIELDS ESCAPED BY` controla como ler ou escrever caracteres especiais:

* Para entrada, se o caractere `FIELDS ESCAPED BY` não estiver vazio, as ocorrências desse caractere são removidas e o caractere seguinte é tomado literalmente como parte de um valor de field. Algumas sequências de dois caracteres são exceções, onde o primeiro caractere é o escape character. Essas sequências são mostradas na tabela a seguir (usando `\` para o escape character). As regras para tratamento de `NULL` são descritas mais adiante nesta seção.

  <table summary="Sequências de dois caracteres para as quais o primeiro caractere (uma \) é o caractere de escape."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Caractere</th> <th>Sequência de Escape</th> </tr></thead><tbody><tr> <td><code>\0</code></td> <td>Um caractere ASCII NUL (<code>X'00'</code>)</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere backspace</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere newline (linefeed)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere carriage return</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere tab.</td> </tr><tr> <td><code>\Z</code></td> <td>ASCII 26 (Control+Z)</td> </tr><tr> <td><code>\N</code></td> <td>NULL</td> </tr></tbody></table>

  Para obter mais informações sobre a sintaxe de escape com `\`, consulte a [Seção 9.1.1, “String Literals”](string-literals.html "9.1.1 String Literals").

  Se o caractere `FIELDS ESCAPED BY` estiver vazio, a interpretação de escape-sequence não ocorre.

* Para saída, se o caractere `FIELDS ESCAPED BY` não estiver vazio, ele é usado para prefixar os seguintes caracteres na saída:

  + O caractere `FIELDS ESCAPED BY`.
  + O caractere `FIELDS [OPTIONALLY] ENCLOSED BY`.

  + O primeiro caractere dos valores `FIELDS TERMINATED BY` e `LINES TERMINATED BY`, se o caractere `ENCLOSED BY` estiver vazio ou não especificado.

  + ASCII `0` (o que é realmente escrito após o escape character é ASCII `0`, não um byte de valor zero).

  Se o caractere `FIELDS ESCAPED BY` estiver vazio, nenhum caractere é escapado e `NULL` é gerado como `NULL`, não `\N`. Provavelmente não é uma boa ideia especificar um escape character vazio, particularmente se os valores de field em seus dados contiverem algum dos caracteres da lista recém-fornecida.

Em certos casos, as opções de tratamento de field e line interagem:

* Se `LINES TERMINATED BY` for uma string vazia e `FIELDS TERMINATED BY` for não vazio, as linhas também são terminadas com `FIELDS TERMINATED BY`.

* Se os valores `FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` estiverem ambos vazios (`''`), um formato de fixed-row (não delimitado) é usado. Com o formato fixed-row, nenhum delimiter é usado entre fields (mas você ainda pode ter um line terminator). Em vez disso, os valores das colunas são lidos e escritos usando uma largura de field ampla o suficiente para conter todos os valores no field. Para [`TINYINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`SMALLINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`MEDIUMINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), as larguras de field são 4, 6, 8, 11 e 20, respectivamente, independentemente da largura de exibição declarada.

  `LINES TERMINATED BY` ainda é usado para separar linhas. Se uma linha não contiver todos os fields, o restante das colunas é definido para seus default values. Se você não tiver um line terminator, deve defini-lo como `''`. Neste caso, o arquivo de texto deve conter todos os fields para cada linha.

  O formato fixed-row também afeta o tratamento de valores `NULL`, conforme descrito posteriormente.

  Nota

  O formato de fixed-size não funciona se você estiver usando um character set multibyte.

O tratamento de valores `NULL` varia de acordo com as opções `FIELDS` e `LINES` em uso:

* Para os default values de `FIELDS` e `LINES`, `NULL` é escrito como um valor de field de `\N` para saída, e um valor de field de `\N` é lido como `NULL` para entrada (assumindo que o caractere `ESCAPED BY` seja `\`).

* Se `FIELDS ENCLOSED BY` não estiver vazio, um field contendo a palavra literal `NULL` como seu valor é lido como um valor `NULL`. Isso difere da palavra `NULL` envolvida por caracteres `FIELDS ENCLOSED BY`, que é lida como a string `'NULL'`.

* Se `FIELDS ESCAPED BY` estiver vazio, `NULL` é escrito como a palavra `NULL`.

* Com o formato fixed-row (que é usado quando `FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` estão ambos vazios), `NULL` é escrito como uma string vazia. Isso faz com que tanto valores `NULL` quanto strings vazias na tabela sejam indistinguíveis quando escritos no arquivo, porque ambos são escritos como strings vazias. Se você precisar ser capaz de diferenciar os dois ao ler o arquivo de volta, você não deve usar o formato fixed-row.

Uma tentativa de carregar `NULL` em uma coluna `NOT NULL` produz um warning ou um erro de acordo com as regras descritas em [Atribuição de Valores de Colunas](load-data.html#load-data-column-assignments "Column Value Assignment").

Alguns casos não são suportados por [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"):

* Linhas de tamanho fixo (com `FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` ambos vazios) e colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types").

* Se você especificar um separator que é o mesmo que ou um prefixo de outro, [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") não consegue interpretar a entrada corretamente. Por exemplo, a seguinte cláusula `FIELDS` causaria problemas:

  ```sql
  FIELDS TERMINATED BY '"' ENCLOSED BY '"'
  ```

* Se `FIELDS ESCAPED BY` estiver vazio, um valor de field que contenha uma ocorrência de `FIELDS ENCLOSED BY` ou `LINES TERMINATED BY` seguido pelo valor `FIELDS TERMINATED BY` faz com que [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") pare de ler um field ou linha muito cedo. Isso acontece porque [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") não consegue determinar corretamente onde o valor do field ou da linha termina.

#### Especificação da Lista de Colunas

O exemplo a seguir carrega todas as colunas da tabela `persondata`:

```sql
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata;
```

Por padrão, quando nenhuma lista de colunas é fornecida no final do statement [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), espera-se que as linhas de entrada contenham um field para cada coluna da tabela. Se você quiser carregar apenas algumas das colunas de uma tabela, especifique uma lista de colunas:

```sql
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata
(col_name_or_user_var [, col_name_or_user_var] ...);
```

Você também deve especificar uma lista de colunas se a ordem dos fields no arquivo de entrada for diferente da ordem das colunas na tabela. Caso contrário, o MySQL não pode dizer como fazer o match entre fields de entrada e colunas da tabela.

#### Pré-processamento de Entrada

Cada instância de *`col_name_or_user_var`* na sintaxe [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") é um nome de coluna ou uma `user variable`. Com `user variables`, a cláusula `SET` permite que você execute transformações de pré-processamento em seus valores antes de atribuir o resultado às colunas.

`User variables` na cláusula `SET` podem ser usadas de várias maneiras. O exemplo a seguir usa a primeira coluna de entrada diretamente para o valor de `t1.column1` e atribui a segunda coluna de entrada a uma `user variable` que é submetida a uma operação de divisão antes de ser usada para o valor de `t1.column2`:

```sql
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, @var1)
  SET column2 = @var1/100;
```

A cláusula `SET` pode ser usada para fornecer valores não derivados do arquivo de entrada. O statement a seguir define `column3` para a data e hora atuais:

```sql
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, column2)
  SET column3 = CURRENT_TIMESTAMP;
```

Você também pode descartar um valor de entrada atribuindo-o a uma `user variable` e não atribuindo a variável a nenhuma coluna da tabela:

```sql
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, @dummy, column2, @dummy, column3);
```

O uso da lista de coluna/variável e da cláusula `SET` está sujeito às seguintes restrições:

* As atribuições na cláusula `SET` devem ter apenas nomes de coluna no lado esquerdo dos operadores de atribuição.

* Você pode usar subqueries no lado direito das atribuições `SET`. Uma subquery que retorna um valor a ser atribuído a uma coluna pode ser apenas uma scalar subquery. Além disso, você não pode usar uma subquery para selecionar da tabela que está sendo carregada.

* As linhas ignoradas por uma cláusula `IGNORE number LINES` não são processadas para a lista de coluna/variável ou a cláusula `SET`.

* `User variables` não podem ser usadas ao carregar dados com formato fixed-row porque `user variables` não têm uma largura de exibição.

#### Atribuição de Valores de Colunas

Para processar uma linha de entrada, [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") a divide em fields e usa os valores de acordo com a lista de coluna/variável e a cláusula `SET`, se estiverem presentes. Em seguida, a linha resultante é inserida na tabela. Se houver triggers `BEFORE INSERT` ou `AFTER INSERT` para a tabela, eles são ativados antes ou depois de inserir a linha, respectivamente.

A interpretação dos valores de field e a atribuição às colunas da tabela dependem destes fatores:

* O SQL mode (o valor da variável de sistema [`sql_mode`](server-system-variables.html#sysvar_sql_mode)). O mode pode ser nonstrictive ou restritivo de várias maneiras. Por exemplo, o strict SQL mode pode ser habilitado, ou o mode pode incluir valores como [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) ou [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date).

* Presença ou ausência dos modificadores `IGNORE` e `LOCAL`.

Esses fatores se combinam para produzir uma interpretação de dados restritiva ou nonrestrictive por [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"):

* A interpretação de dados é restritiva se o SQL mode for restritivo e nem o modificador `IGNORE` nem `LOCAL` for especificado. Erros encerram a operação de carregamento.

* A interpretação de dados é nonrestrictive se o SQL mode for nonrestrictive ou se o modificador `IGNORE` ou `LOCAL` for especificado. (Em particular, qualquer um dos modificadores, se especificado, *substitui* um SQL mode restritivo.) Erros se tornam warnings e a operação de carregamento continua.

A interpretação restritiva de dados usa estas regras:

* Muitos ou poucos fields resultam em um erro.
* Atribuir `NULL` (ou seja, `\N`) a uma coluna non-`NULL` resulta em um erro.

* Um valor que está fora do range para o data type da coluna resulta em um erro.

* Valores inválidos produzem erros. Por exemplo, um valor como `'x'` para uma coluna numérica resulta em um erro, não em conversão para 0.

Por outro lado, a interpretação nonrestrictive de dados usa estas regras:

* Se uma linha de entrada tiver muitos fields, os fields extras são ignorados e o número de warnings é incrementado.

* Se uma linha de entrada tiver poucos fields, as colunas para as quais faltam fields de entrada são atribuídas aos seus default values. A atribuição de default value é descrita na [Seção 11.6, “Valores Padrão de Data Type”](data-type-defaults.html "11.6 Data Type Default Values").

* Atribuir `NULL` (ou seja, `\N`) a uma coluna non-`NULL` resulta na atribuição do implicit default value para o data type da coluna. Os implicit default values são descritos na [Seção 11.6, “Valores Padrão de Data Type”](data-type-defaults.html "11.6 Data Type Default Values").

* Valores inválidos produzem warnings em vez de erros e são convertidos para o valor válido "mais próximo" para o data type da coluna. Exemplos:

  + Um valor como `'x'` para uma coluna numérica resulta em conversão para 0.

  + Um valor numérico ou temporal fora do range é truncado para o endpoint mais próximo do range para o data type da coluna.

  + Um valor inválido para uma coluna `DATETIME`, `DATE` ou `TIME` é inserido como o implicit default value, independentemente da configuração [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) do SQL mode. O default implícito é o valor "zero" apropriado para o type (`'0000-00-00 00:00:00'`, `'0000-00-00'` ou `'00:00:00'`). Consulte a [Seção 11.2, “Date and Time Data Types”](date-and-time-types.html "11.2 Date and Time Data Types").

* [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") interpreta um valor de field vazio de forma diferente de um field ausente:

  + Para string types, a coluna é definida para a string vazia.
  + Para numeric types, a coluna é definida para `0`.

  + Para date and time types, a coluna é definida para o valor "zero" apropriado para o type. Consulte a [Seção 11.2, “Date and Time Data Types”](date-and-time-types.html "11.2 Date and Time Data Types").

  Estes são os mesmos valores que resultam se você atribuir uma string vazia explicitamente a um tipo string, numérico, ou date or time explicitamente em um statement [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`UPDATE`](update.html "13.2.11 UPDATE Statement").

As colunas [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") são definidas para a data e hora atuais apenas se houver um valor `NULL` para a coluna (ou seja, `\N`) e a coluna não for declarada para permitir valores `NULL`, ou se o default value da coluna [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") for o timestamp atual e ele for omitido da lista de fields quando uma lista de fields é especificada.

[`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") considera toda a entrada como strings, então você não pode usar valores numéricos para colunas [`ENUM`](enum.html "11.3.5 The ENUM Type") ou [`SET`](set.html "11.3.6 The SET Type") da maneira que você pode com statements [`INSERT`](insert.html "13.2.5 INSERT Statement"). Todos os valores [`ENUM`](enum.html "11.3.5 The ENUM Type") e [`SET`](set.html "11.3.6 The SET Type") devem ser especificados como strings.

Valores [`BIT`](bit-type.html "11.1.5 Bit-Value Type - BIT") não podem ser carregados diretamente usando notação binária (por exemplo, `b'011010'`). Para contornar isso, use a cláusula `SET` para remover o `b'` inicial e o `'` final e execute uma conversão de base-2 para base-10 para que o MySQL carregue os valores na coluna [`BIT`](bit-type.html "11.1.5 Bit-Value Type - BIT") corretamente:

```sql
$> cat /tmp/bit_test.txt
b'10'
b'1111111'
$> mysql test
mysql> LOAD DATA INFILE '/tmp/bit_test.txt'
       INTO TABLE bit_test (@var1)
       SET b = CAST(CONV(MID(@var1, 3, LENGTH(@var1)-3), 2, 10) AS UNSIGNED);
Query OK, 2 rows affected (0.00 sec)
Records: 2  Deleted: 0  Skipped: 0  Warnings: 0

mysql> SELECT BIN(b+0) FROM bit_test;
+----------+
| BIN(b+0) |
+----------+
| 10       |
| 1111111  |
+----------+
2 rows in set (0.00 sec)
```

Para valores [`BIT`](bit-type.html "11.1.5 Bit-Value Type - BIT") na notação binária `0b` (por exemplo, `0b011010`), use esta cláusula `SET` em vez disso para remover o `0b` inicial:

```sql
SET b = CAST(CONV(MID(@var1, 3, LENGTH(@var1)-2), 2, 10) AS UNSIGNED)
```

#### Suporte a Tabelas Particionadas

[`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") suporta seleção explícita de `partition` usando a cláusula `PARTITION` com uma lista de um ou mais nomes de partitions, subpartitions, ou ambos, separados por vírgulas. Quando esta cláusula é usada, se alguma linha do arquivo não puder ser inserida em nenhuma das partitions ou subpartitions nomeadas na lista, o statement falha com o erro "Found a row not matching the given partition set". Para mais informações e exemplos, consulte a [Seção 22.5, “Seleção de Partition”](partitioning-selection.html "22.5 Partition Selection").

Para tabelas particionadas usando `storage engines` que empregam `table locks`, como [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") não pode podar nenhum `partition lock`. Isso não se aplica a tabelas que usam `storage engines` que empregam `row-level locking`, como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). Para mais informações, consulte a [Seção 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").

#### Considerações sobre Concorrência

Com o modificador `LOW_PRIORITY`, a execução do statement [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") é atrasada até que nenhum outro client esteja lendo da tabela. Isso afeta apenas `storage engines` que usam apenas `table-level locking` (como `MyISAM`, `MEMORY` e `MERGE`).

Com o modificador `CONCURRENT` e uma tabela `MyISAM` que satisfaça a condição para `concurrent inserts` (ou seja, não contém blocos livres no meio), outros `Threads` podem recuperar dados da tabela enquanto [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") está sendo executado. Este modificador afeta um pouco a performance de [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), mesmo que nenhum outro `Thread` esteja usando a tabela ao mesmo tempo.

#### Informações de Resultado do Statement

Quando o statement [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") termina, ele retorna uma information string no seguinte formato:

```sql
Records: 1  Deleted: 0  Skipped: 0  Warnings: 0
```

Warnings ocorrem sob as mesmas circunstâncias que quando os valores são inseridos usando o statement [`INSERT`](insert.html "13.2.5 INSERT Statement") (consulte a [Seção 13.2.5, “INSERT Statement”](insert.html "13.2.5 INSERT Statement")), exceto que [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") também gera warnings quando há poucos ou muitos fields na linha de entrada.

Você pode usar [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") para obter uma lista dos primeiros [`max_error_count`](server-system-variables.html#sysvar_max_error_count) warnings como informação sobre o que deu errado. Consulte a [Seção 13.7.5.40, “SHOW WARNINGS Statement”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement").

Se você estiver usando a C API, você pode obter informações sobre o statement chamando a função [`mysql_info()`](/doc/c-api/5.7/en/mysql-info.html). Consulte [mysql_info()](/doc/c-api/5.7/en/mysql-info.html).

#### Considerações sobre Replicação

Para obter informações sobre [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") em relação à Replication, consulte a [Seção 16.4.1.18, “Replication and LOAD DATA”](replication-features-load-data.html "16.4.1.18 Replication and LOAD DATA").

#### Tópicos Diversos

No Unix, se você precisar que [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") leia de um pipe, você pode usar a seguinte técnica (o exemplo carrega uma listagem do diretório `/` na tabela `db1.t1`):

```sql
mkfifo /mysql/data/db1/ls.dat
chmod 666 /mysql/data/db1/ls.dat
find / -ls > /mysql/data/db1/ls.dat &
mysql -e "LOAD DATA INFILE 'ls.dat' INTO TABLE t1" db1
```

Aqui você deve executar o comando que gera os dados a serem carregados e os comandos [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") em terminais separados, ou executar o processo de geração de dados em background (conforme mostrado no exemplo anterior). Se você não fizer isso, o pipe bloqueia até que os dados sejam lidos pelo processo [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").