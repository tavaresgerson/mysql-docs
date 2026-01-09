### 15.2.9 Declaração `LOAD DATA`

```
LOAD DATA
    [LOW_PRIORITY | CONCURRENT] [LOCAL]
    INFILE 'file_name'
    [REPLACE | IGNORE]
    INTO TABLE tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [CHARACTER SET charset_name]
    [{FIELDS | COLUMNS}
        [TERMINATED BY 'string']
        [[OPTIONALLY] ENCLOSED BY 'char']
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

A declaração `LOAD DATA` lê linhas de um arquivo de texto para uma tabela com uma velocidade muito alta. O arquivo pode ser lido do host do servidor ou do host do cliente, dependendo se o modificador `LOCAL` é fornecido. `LOCAL` também afeta a interpretação dos dados e o tratamento de erros.

`LOAD DATA` é o complemento da declaração `SELECT ... INTO OUTFILE`. (Veja a Seção 15.2.13.1, “Declaração SELECT ... INTO”.) Para escrever dados de uma tabela para um arquivo, use `SELECT ... INTO OUTFILE`. Para ler o arquivo de volta para uma tabela, use `LOAD DATA`. A sintaxe das cláusulas `FIELDS` e `LINES` é a mesma para ambas as declarações.

O utilitário **mysqlimport** fornece outra maneira de carregar arquivos de dados; ele opera enviando uma declaração `LOAD DATA` para o servidor. Veja a Seção 6.5.5, “mysqlimport — Um Programa de Importação de Dados”.

Para informações sobre a eficiência de `INSERT` versus `LOAD DATA` e sobre como acelerar `LOAD DATA`, veja a Seção 10.2.5.1, “Otimizando Declarações INSERT”.

* Operação Não-LOCAL versus LOCAL
* Conjunto de Caracteres do Arquivo de Entrada
* Localização do Arquivo de Entrada
* Requisitos de Segurança
* Tratamento de Chave Duplicada e Erros
* Tratamento de Índices
* Tratamento de Campo e Linha
* Especificação da Lista de Colunas
* Pré-processamento de Entrada
* Atribuição de Valor de Coluna
* Suporte a Tabelas Partidas
* Considerações de Concorrência
* Informações sobre o Resultado da Declaração
* Considerações de Replicação
* Tópicos Diversos

#### Operação Não-LOCAL versus LOCAL

O modificador `LOCAL` afeta esses aspectos da `LOAD DATA`, em comparação com a operação não `LOCAL`:

* Ele altera a localização esperada do arquivo de entrada; veja Localização do Arquivo de Entrada.

* Ele altera os requisitos de segurança da declaração; veja Requisitos de Segurança.

* A menos que `REPLACE` também seja especificado, `LOCAL` tem o mesmo efeito que o modificador `IGNORE` na interpretação do conteúdo do arquivo de entrada e no tratamento de erros; veja Duplicatas de Chave e Tratamento de Erros e Atribuição de Valor de Coluna.

`LOCAL` funciona apenas se o servidor e seu cliente estiverem configurados para permitir isso. Por exemplo, se o **mysqld** foi iniciado com a variável de sistema `local_infile` desativada, `LOCAL` produz um erro. Veja a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

#### Conjunto de Caracteres do Arquivo de Entrada

O nome do arquivo deve ser fornecido como uma string literal. No Windows, especifique barras invertidas em nomes de caminho como barras largas ou barras invertidas duplas. O servidor interpreta o nome do arquivo usando o conjunto de caracteres indicado pela variável de sistema `character_set_filesystem`.

Por padrão, o servidor interpreta o conteúdo do arquivo usando o conjunto de caracteres indicado pela variável de sistema `character_set_database`. Se o conteúdo do arquivo usar um conjunto de caracteres diferente desse padrão, é uma boa ideia especificar esse conjunto de caracteres usando a cláusula `CHARACTER SET`. Um conjunto de caracteres de `binary` especifica “sem conversão”.

`SET NAMES` e a configuração de `character_set_client` não afetam a interpretação do conteúdo do arquivo.

`LOAD DATA` interpreta todos os campos no arquivo como tendo o mesmo conjunto de caracteres, independentemente dos tipos de dados das colunas nos quais os valores dos campos são carregados. Para uma interpretação adequada do arquivo, você deve garantir que ele foi escrito com o conjunto de caracteres correto. Por exemplo, se você escrever um arquivo de dados com **mysqldump -T** ou executando uma declaração `SELECT ... INTO OUTFILE` em **mysql**, certifique-se de usar a opção `--default-character-set` para escrever a saída no conjunto de caracteres a ser usado quando o arquivo for carregado com `LOAD DATA`.

Nota

Não é possível carregar arquivos de dados que utilizam o conjunto de caracteres `ucs2`, `utf16`, `utf16le` ou `utf32`.

#### Localização do arquivo de entrada

Estas regras determinam a localização do arquivo de entrada `LOAD DATA`:

* Se `LOCAL` não for especificado, o arquivo deve estar localizado no host do servidor. O servidor lê o arquivo diretamente, localizando-o da seguinte forma:

  + Se o nome do arquivo for um nome de caminho absoluto, o servidor usa-o conforme fornecido.

  + Se o nome do arquivo for um nome de caminho relativo com componentes iniciais, o servidor procura o arquivo em relação ao seu diretório de dados.

  + Se o nome do arquivo não tiver componentes iniciais, o servidor procura o arquivo no diretório da base de dados da base de dados padrão.

* Se `LOCAL` for especificado, o arquivo deve estar localizado no host do cliente. O programa cliente lê o arquivo, localizando-o da seguinte forma:

  + Se o nome do arquivo for um nome de caminho absoluto, o programa cliente usa-o conforme fornecido.

  + Se o nome do arquivo for um nome de caminho relativo, o programa cliente procura o arquivo em relação ao seu diretório de invocação.

Quando `LOCAL` é usado, o programa cliente lê o arquivo e envia seu conteúdo para o servidor. O servidor cria uma cópia do arquivo no diretório onde armazena arquivos temporários. Veja a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”. A falta de espaço suficiente para a cópia neste diretório pode fazer com que a instrução `LOAD DATA LOCAL` falhe.

As regras não `LOCAL` significam que o servidor lê um arquivo chamado `./myfile.txt` relativo ao seu diretório de dados, enquanto lê um arquivo chamado `myfile.txt` do diretório de banco de dados do banco de dados padrão. Por exemplo, se a seguinte instrução `LOAD DATA` for executada enquanto `db1` é o banco de dados padrão, o servidor lê o arquivo `data.txt` do diretório de banco de dados para `db1`, mesmo que a instrução carregue explicitamente o arquivo em uma tabela no banco de dados `db2`:

```
LOAD DATA INFILE 'data.txt' INTO TABLE db2.my_table;
```

Nota

O servidor também usa as regras não `LOCAL` para localizar arquivos `.sdi` para a instrução `IMPORT TABLE`.

#### Requisitos de Segurança

Para uma operação de carregamento não `LOCAL`, o servidor lê um arquivo de texto localizado no host do servidor, então esses requisitos de segurança devem ser atendidos:

* Você deve ter o privilégio `FILE`. Veja a Seção 8.2.2, “Privilégios Fornecidos pelo MySQL”.

* A operação está sujeita à configuração da variável de sistema `secure_file_priv`:

  + Se o valor da variável for um nome de diretório não vazio, o arquivo deve estar localizado nesse diretório.

  + Se o valor da variável for vazio (o que é inseguro), o arquivo só precisa ser legível pelo servidor.

Para uma operação de carregamento `LOCAL`, o programa cliente lê um arquivo de texto localizado no host do cliente. Como o conteúdo do arquivo é enviado pela conexão pelo cliente para o servidor, usar `LOCAL` é um pouco mais lento do que quando o servidor acessa o arquivo diretamente. Por outro lado, você não precisa do privilégio `FILE`, e o arquivo pode estar localizado em qualquer diretório que o programa cliente possa acessar.

#### Gerenciamento de Chave Duplicada e Erros

Os modificadores `REPLACE` e `IGNORE` controlam o gerenciamento de novas (entrada) linhas que duplicam linhas de tabela existentes com valores de chave única (`PRIMARY KEY` ou valores de índice `UNIQUE`):

* Com `REPLACE`, novas linhas que têm o mesmo valor que um valor de chave única em uma linha existente substituem a linha existente. Veja a Seção 15.2.12, “Instrução REPLACE”.

* Com `IGNORE`, novas linhas que duplicam uma linha existente em um valor de chave única são descartadas. Para mais informações, consulte O Efeito de IGNORE na Execução da Instrução.

O modificador `LOCAL` tem o mesmo efeito que `IGNORE`. Isso ocorre porque o servidor não tem como interromper a transmissão do arquivo no meio da operação.

Se nenhuma das opções `REPLACE`, `IGNORE` ou `LOCAL` for especificada, um erro ocorre quando um valor de chave duplicado é encontrado, e o restante do arquivo de texto é ignorado.

Além de afetar o tratamento de chaves duplicadas como descrito acima, `IGNORE` e `LOCAL` também afetam o tratamento de erros:

* Quando nenhuma das opções `IGNORE` ou `LOCAL` é especificada, erros de interpretação de dados encerram a operação.

* Quando `IGNORE`—ou `LOCAL` sem `REPLACE`—é especificado, erros de interpretação de dados se tornam avisos e a operação de carregamento continua, mesmo que o modo SQL seja restritivo. Para exemplos, consulte Atribuição de Valor de Coluna.

#### Manipulação de Índices

Para ignorar as restrições de chave estrangeira durante a operação de carregamento, execute uma instrução `SET foreign_key_checks = 0` antes de executar `LOAD DATA`.

Se você usar `LOAD DATA` em uma tabela `MyISAM` vazia, todos os índices não únicos são criados em um lote separado (como no caso de `REPAIR TABLE`). Normalmente, isso torna `LOAD DATA` muito mais rápido quando você tem muitos índices. Em alguns casos extremos, você pode criar os índices ainda mais rápido, desabilitando-os com `ALTER TABLE ... DISABLE KEYS` antes de carregar o arquivo na tabela e recriar os índices com `ALTER TABLE ... ENABLE KEYS` após carregar o arquivo. Veja a Seção 10.2.5.1, “Otimizando Instruções INSERT”.

#### Manipulação de Campos e Linhas

Para as instruções `LOAD DATA` e `SELECT ... INTO OUTFILE`, a sintaxe das cláusulas `FIELDS` e `LINES` é a mesma. Ambas as cláusulas são opcionais, mas `FIELDS` deve preceder `LINES` se ambas forem especificadas.

Se você especificar uma cláusula `FIELDS`, cada uma de suas subcláusulas (`TERMINATED BY`, `[OPTIONALLY] ENCLOSED BY` e `ESCAPED BY`) também é opcional, exceto que você deve especificar pelo menos uma delas. Os argumentos dessas cláusulas são permitidos para conter apenas caracteres ASCII.

Se você não especificar nenhuma cláusula `FIELDS` ou `LINES`, os valores padrão são os mesmos se você tivesse escrito isso:

```
FIELDS TERMINATED BY '\t' ENCLOSED BY '' ESCAPED BY '\\'
LINES TERMINATED BY '\n' STARTING BY ''
```

O backslash é o caractere de escape MySQL dentro de strings em instruções SQL. Assim, para especificar um backslash literal, você deve especificar dois backslashes para que o valor seja interpretado como um único backslash. As sequências de escape `'\t'` e `'\n'` especificam caracteres de tabulação e nova linha, respectivamente.

Em outras palavras, os valores padrão fazem com que `LOAD DATA` atue da seguinte forma ao ler a entrada:

* Procure por limites de linha em novas linhas.
* Não pule nenhuma linha prefixada.
* Divida as linhas em campos em tabulações.
* Não espere que os campos estejam dentro de quaisquer caracteres de citação.

* Interprete caracteres precedidos pelo caractere de escape `\` como sequências de escape. Por exemplo, `\t`, `\n` e `\\` significam tabulação, nova linha e backslash, respectivamente. Veja a discussão sobre `FIELDS ESCAPED BY` mais adiante para a lista completa de sequências de escape.

Por outro lado, os valores padrão fazem com que `SELECT ... INTO OUTFILE` atue da seguinte forma ao escrever a saída:

* Escreva tabulações entre os campos.
* Não encerre os campos dentro de quaisquer caracteres de citação.
* Use `\` para escapar instâncias de tabulação, nova linha ou `\` que ocorrem dentro dos valores dos campos.

* Escreva novas linhas no final das linhas.

Nota

Para um arquivo de texto gerado em um sistema Windows, a leitura adequada do arquivo pode exigir `LINHAS TERMINADAS POR '\r\n'`, pois os programas do Windows geralmente usam dois caracteres como finalizador de linha. Alguns programas, como o **WordPad**, podem usar `\r` como finalizador de linha ao gravar arquivos. Para ler tais arquivos, use `LINHAS TERMINADAS POR '\r'`.

Se todas as linhas de entrada tiverem um prefixo comum que você deseja ignorar, você pode usar `LINHAS COMEÇANDO POR 'prefix_string'` para ignorar o prefixo *e qualquer coisa antes dele*. Se uma linha não incluir o prefixo, toda a linha é ignorada. Suponha que você emita a seguinte declaração:

```
LOAD DATA INFILE '/tmp/test.txt' INTO TABLE test
  FIELDS TERMINATED BY ','  LINES STARTING BY 'xxx';
```

Se o arquivo de dados parecer assim:

```
xxx"abc",1
something xxx"def",2
"ghi",3
```

As linhas resultantes são `("abc",1)` e `("def",2)`. A terceira linha do arquivo é ignorada porque não contém o prefixo.

A cláusula `IGNORE número LINHAS` pode ser usada para ignorar linhas no início do arquivo. Por exemplo, você pode usar `IGNORE 1 LINHAS` para ignorar uma linha de cabeçalho inicial que contém os nomes das colunas:

```
LOAD DATA INFILE '/tmp/test.txt' INTO TABLE test IGNORE 1 LINES;
```

Quando você usa `SELECT ... INTO OUTFILE` em conjunto com `LOAD DATA` para escrever dados de um banco de dados em um arquivo e, em seguida, ler o arquivo de volta para o banco de dados mais tarde, as opções de manipulação de campos e linhas para ambas as declarações devem corresponder. Caso contrário, `LOAD DATA` não interpreta corretamente o conteúdo do arquivo. Suponha que você use `SELECT ... INTO OUTFILE` para escrever um arquivo com campos delimitados por vírgulas:

```
SELECT * INTO OUTFILE 'data.txt'
  FIELDS TERMINATED BY ','
  FROM table2;
```

Para ler o arquivo delimitado por vírgulas, a declaração correta é:

```
LOAD DATA INFILE 'data.txt' INTO TABLE table2
  FIELDS TERMINATED BY ',';
```

Se, em vez disso, você tentasse ler o arquivo com a declaração mostrada a seguir, isso não funcionaria porque instrui `LOAD DATA` a procurar tabulações entre os campos:

```
LOAD DATA INFILE 'data.txt' INTO TABLE table2
  FIELDS TERMINATED BY '\t';
```

O resultado provável é que cada linha de entrada seria interpretada como um único campo.

`LOAD DATA` pode ser usado para ler arquivos obtidos de fontes externas. Por exemplo, muitos programas podem exportar dados no formato de valores separados por vírgula (CSV), de modo que as linhas tenham campos separados por vírgulas e encerrados entre aspas duplas, com uma linha inicial de nomes de colunas. Se as linhas desse arquivo forem terminadas por pares de retorno de carro/nova linha, a declaração mostrada aqui ilustra as opções de manipulação de campos e linhas que você usaria para carregar o arquivo:

```
LOAD DATA INFILE 'data.txt' INTO TABLE tbl_name
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\r\n'
  IGNORE 1 LINES;
```

Se os valores de entrada não forem necessariamente encerrados entre aspas, use `OPTIONALLY` antes da opção `ENCLOSED BY`.

Qualquer das opções de manipulação de campos ou linhas pode especificar uma string vazia (`''`). Se não for vazia, os valores de `FIELDS [OPTIONALLY] ENCLOSED BY` e `FIELDS ESCAPED BY` devem ser um único caractere. Os valores de `FIELDS TERMINATED BY`, `LINES STARTING BY` e `LINES TERMINATED BY` podem ser mais de um caractere. Por exemplo, para escrever linhas que são terminadas por pares de retorno de carro/nova linha, ou para ler um arquivo contendo tais linhas, especifique uma cláusula `LINES TERMINATED BY '\r\n'`.

Para ler um arquivo contendo piadas que são separadas por linhas consistindo em `%%`, você pode fazer isso

```
CREATE TABLE jokes
  (a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  joke TEXT NOT NULL);
LOAD DATA INFILE '/tmp/jokes.txt' INTO TABLE jokes
  FIELDS TERMINATED BY ''
  LINES TERMINATED BY '\n%%\n' (joke);
```

`FIELDS [OPTIONALLY] ENCLOSED BY` controla a citação de campos. Para saída (`SELECT ... INTO OUTFILE`), se você omitir a palavra `OPTIONALLY`, todos os campos são encerrados pelo caractere `ENCLOSED BY`. Um exemplo de tal saída (usando uma vírgula como delimitador de campo) é mostrado aqui:

```
"1","a string","100.20"
"2","a string containing a , comma","102.20"
"3","a string containing a \" quote","102.20"
"4","a string containing a \", quote and comma","102.20"
```

Se você especificar `OPTIONALLY`, o caractere `ENCLOSED BY` é usado apenas para encerrar valores de colunas que têm um tipo de dado de string (como `CHAR`, `BINARY`, `TEXT` ou `ENUM`):

```
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a \" quote",102.20
4,"a string containing a \", quote and comma",102.20
```

Ocorrência do caractere `ENCLOSED BY` dentro de um valor de campo é escapado prefixando-o com o caractere `ESCAPED BY`. Além disso, se você especificar um valor `ESCAPED BY` vazio, é possível gerar inadvertidamente uma saída que não pode ser lida corretamente pelo `LOAD DATA`. Por exemplo, a saída anterior mostrada anteriormente apareceria da seguinte forma se o caractere de escape fosse vazio. Observe que o segundo campo na quarta linha contém uma vírgula após a citação, que (erradamente) parece terminar o campo:

```
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a " quote",102.20
4,"a string containing a ", quote and comma",102.20
```

Para a entrada, o caractere `ENCLOSED BY`, se presente, é removido das extremidades dos valores de campo. Isso é verdadeiro independentemente de `OPTIONALLY` ser especificado; `OPTIONALLY` não tem efeito na interpretação da entrada. Ocorrências do caractere `ENCLOSED BY` precedido pelo caractere `ESCAPED BY` são interpretadas como parte do valor atual do campo.

Se o campo começar com o caractere `ENCLOSED BY`, as instâncias desse caractere são reconhecidas como terminando um valor de campo apenas se forem seguidas pela sequência de campo ou linha `TERMINATED BY`. Para evitar ambiguidade, ocorrências do caractere `ENCLOSED BY` dentro de um valor de campo podem ser duplicadas e são interpretadas como uma única instância do caractere. Por exemplo, se `ENCLOSED BY '"'` for especificado, as aspas são tratadas como mostrado aqui:

```
"The ""BIG"" boss"  -> The "BIG" boss
The "BIG" boss      -> The "BIG" boss
The ""BIG"" boss    -> The ""BIG"" boss
```

`FIELDS ESCAPED BY` controla como ler ou escrever caracteres especiais:

* Para entrada, se o caractere `FIELDS ESCAPED BY` não estiver vazio, as ocorrências desse caractere são removidas e o caractere seguinte é lido literalmente como parte do valor de um campo. Algumas sequências de dois caracteres que são exceções, onde o primeiro caractere é o caractere de escape. Essas sequências estão mostradas na tabela a seguir (usando `\` para o caractere de escape). As regras para o tratamento de `NULL` são descritas mais adiante nesta seção.

<table summary="Sequências de dois caracteres para as quais o primeiro caractere (`) é o caractere de escape."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Caractere</th> <th>Sequência de Escape</th> </tr></thead><tbody><tr> <td><code>\0</code></td> <td>Um caractere ASCII NUL (<code>X'00'</code>)</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere de recuo</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova linha (linefeed)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere de retorno de carro</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação</td> </tr><tr> <td><code>\Z</code></td> <td>ASCII 26 (Control+Z)</td> </tr><tr> <td><code>\N</code></td> <td>NULL</td> </tr></tbody></table>

  Para mais informações sobre a sintaxe de escape `\`-escape, consulte a Seção 11.1.1, “Letras de String”.

  Se o caractere `FIELDS ESCAPED BY` estiver vazio, a interpretação da sequência de escape não ocorre.

* Para a saída, se o caractere `FIELDS ESCAPED BY` não estiver vazio, ele é usado para prefixar os caracteres seguintes na saída:

  + O caractere `FIELDS ESCAPED BY`.
  + O caractere `FIELDS [OPTIONALLY] ENCLOSED BY`.

  + O primeiro caractere dos valores `FIELDS TERMINATED BY` e `LINES TERMINATED BY`, se o caractere `ENCLOSED BY` estiver vazio ou não especificado.

  + ASCII `0` (o que é realmente escrito após o caractere de escape é ASCII `0`, não um byte de valor nulo).

Se o caractere `FIELDS ESCAPED BY` estiver vazio, nenhum caractere é escamado e `NULL` é exibido como `NULL`, não `\N`. Provavelmente não é uma boa ideia especificar um caractere de escape vazio, especialmente se os valores dos campos em seus dados contiverem algum dos caracteres da lista fornecida.

Em certos casos, as opções de manipulação de campos e linhas interagem:

* Se `LINES TERMINATED BY` for uma string vazia e `FIELDS TERMINATED BY` não estiver vazio, as linhas também são terminadas com `FIELDS TERMINATED BY`.

* Se os valores de `FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` estiverem ambos vazios (`''`), um formato de linha fixa (não delimitada) é usado. Com o formato de linha fixa, não são usados delimitadores entre os campos (mas você ainda pode ter um finalizador de linha). Em vez disso, os valores das colunas são lidos e escritos usando uma largura de campo o suficiente para conter todos os valores no campo. Para `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), as larguras dos campos são 4, 6, 8, 11 e 20, respectivamente, independentemente da largura de exibição declarada.

`LINHAS TERMINADAS POR` ainda é usado para separar linhas. Se uma linha não contém todos os campos, o resto das colunas é definido com seus valores padrão. Se você não tiver um finalizador de linha, deve definir isso como `''`. Neste caso, o arquivo de texto deve conter todos os campos para cada linha.

O formato de linha fixa também afeta o tratamento de valores `NULL`, conforme descrito mais adiante.

Nota

O formato de tamanho fixo não funciona se você estiver usando um conjunto de caracteres multibyte.

O tratamento de valores `NULL` varia de acordo com as opções `FIELDS` e `LINES` em uso:

* Para os valores padrão de `FIELDS` e `LINES`, `NULL` é escrito como um valor de campo de `\N` para saída e um valor de campo de `\N` é lido como `NULL` para entrada (assumindo que o caractere `ESCAPED BY` é `\`).

* Se `FIELDS ENCLOSED BY` não estiver vazio, um campo que contenha a palavra literal `NULL` como seu valor é lido como um valor `NULL`. Isso difere da palavra `NULL` fechada dentro dos caracteres `FIELDS ENCLOSED BY`, que é lida como a string `'NULL'`.

* Se `FIELDS ESCAPED BY` estiver vazio, `NULL` é escrito como a palavra `NULL`.

* Com o formato de linha fixa (que é usado quando `FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` estão ambos vazios), `NULL` é escrito como uma string vazia. Isso faz com que tanto os valores `NULL` quanto as strings vazias na tabela sejam indistinguíveis quando escritos no arquivo, pois ambos são escritos como strings vazias. Se você precisar ser capaz de distinguir os dois ao ler o arquivo de volta, não deve usar o formato de linha fixa.

Uma tentativa de carregar `NULL` em uma coluna `NOT NULL` produz um aviso ou erro de acordo com as regras descritas na Atribuição de Valor de Coluna.

Alguns casos não são suportados pelo `LOAD DATA`:

* Linhas de tamanho fixo (`FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` ambos vazios) e colunas `BLOB` ou `TEXT`.

* Se você especificar um separador que seja igual a outro ou um prefixo de outro, o `LOAD DATA` não consegue interpretar a entrada corretamente. Por exemplo, a seguinte cláusula `FIELDS` causaria problemas:

  ```
  FIELDS TERMINATED BY '"' ENCLOSED BY '"'
  ```
* Se `FIELDS ESCAPED BY` estiver vazio, um valor de campo que contenha uma ocorrência de `FIELDS ENCLOSED BY` ou `LINES TERMINATED BY` seguida do valor `FIELDS TERMINATED BY` faz com que o `LOAD DATA` pare de ler um campo ou linha muito cedo. Isso acontece porque o `LOAD DATA` não consegue determinar corretamente onde o valor do campo ou linha termina.

#### Especificação da Lista de Colunas

O exemplo a seguir carrega todas as colunas da tabela `persondata`:

```
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata;
```

Por padrão, quando não é fornecida uma lista de colunas no final da declaração `LOAD DATA`, as linhas de entrada são esperadas conter um campo para cada coluna da tabela. Se você quiser carregar apenas algumas colunas de uma tabela, especifique uma lista de colunas:

```
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata
(col_name_or_user_var [, col_name_or_user_var] ...);
```

Você também deve especificar uma lista de colunas se a ordem dos campos no arquivo de entrada for diferente da ordem das colunas na tabela. Caso contrário, o MySQL não consegue determinar como corresponder os campos de entrada às colunas da tabela.

#### Pré-processamento da Entrada

Cada instância de *`col_name_or_user_var`* na sintaxe `LOAD DATA` é um nome de coluna ou uma variável de usuário. Com variáveis de usuário, a cláusula `SET` permite que você realize transformações de pré-processamento em seus valores antes de atribuir o resultado às colunas.

Variáveis de usuário na cláusula `SET` podem ser usadas de várias maneiras. O exemplo a seguir usa a primeira coluna de entrada diretamente para o valor de `t1.column1` e atribui a segunda coluna de entrada a uma variável de usuário que é submetida a uma operação de divisão antes de ser usada para o valor de `t1.column2`:

```
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, @var1)
  SET column2 = @var1/100;
```

A cláusula `SET` pode ser usada para fornecer valores que não são derivados do arquivo de entrada. A seguinte declaração define `column3` para a data e hora atuais:

```
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, column2)
  SET column3 = CURRENT_TIMESTAMP;
```

Você também pode descartar um valor de entrada atribuindo-o a uma variável de usuário e não atribuindo a variável a nenhuma coluna da tabela:

```
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, @dummy, column2, @dummy, column3);
```

O uso da lista de colunas/variáveis e da cláusula `SET` está sujeito às seguintes restrições:

* As atribuições na cláusula `SET` devem ter apenas nomes de colunas do lado esquerdo dos operadores de atribuição.

* Você pode usar subconsultas no lado direito das atribuições `SET`. Uma subconsulta que retorna um valor para ser atribuído a uma coluna pode ser apenas uma subconsulta escalar. Além disso, você não pode usar uma subconsulta para selecionar da tabela que está sendo carregada.

* Linhas ignoradas por uma cláusula `IGNORE número LINES` não são processadas para a lista de colunas/variáveis ou a cláusula `SET`.

* Variáveis de usuário não podem ser usadas ao carregar dados com formato de linha fixa porque as variáveis de usuário não têm uma largura de exibição.

#### Atribuição de Valor de Coluna

Para processar uma linha de entrada, `LOAD DATA` a divide em campos e usa os valores de acordo com a lista de colunas/variáveis e a cláusula `SET`, se estiverem presentes. Então, a linha resultante é inserida na tabela. Se houver gatilhos `BEFORE INSERT` ou `AFTER INSERT` para a tabela, eles são ativados antes ou depois de inserir a linha, respectivamente.

A interpretação dos valores dos campos e a atribuição às colunas da tabela dependem desses fatores:

* O modo SQL (o valor da variável de sistema `sql_mode`). O modo pode ser não restritivo ou restritivo de várias maneiras. Por exemplo, o modo SQL estrito pode ser habilitado, ou o modo pode incluir valores como `NO_ZERO_DATE` ou `NO_ZERO_IN_DATE`.

* Presença ou ausência dos modificadores `IGNORE` e `LOCAL`.

Esses fatores combinam-se para produzir uma interpretação de dados restritiva ou não restritiva pelo `LOAD DATA`:

* A interpretação de dados é restritiva se o modo SQL for restritivo e nenhum dos modificadores `IGNORE` ou `LOCAL` for especificado. Os erros encerram a operação de carregamento.

* A interpretação de dados é não restritiva se o modo SQL for não restritivo ou se o modificador `IGNORE` ou `LOCAL` for especificado. (Em particular, qualquer um dos modificadores, se especificado, *anula* um modo SQL restritivo quando o modificador `REPLACE` é omitido.) Os erros se tornam avisos e a operação de carregamento continua.

A interpretação de dados restritiva usa essas regras:

* Um número excessivo ou insuficiente de campos resulta em um erro.

* Atribuir `NULL` (ou seja, `\N`) a uma coluna que não é `NULL` resulta em um erro.

* Um valor fora do intervalo do tipo de dados da coluna resulta em um erro.

* Valores inválidos produzem erros. Por exemplo, um valor como `'x'` para uma coluna numérica resulta em um erro, não em uma conversão para 0.

Em contraste, a interpretação de dados não restritiva usa essas regras:

* Se uma linha de entrada tiver muitos campos, os campos extras são ignorados e o número de avisos é incrementado.

* Se uma linha de entrada tiver poucos campos, as colunas que não têm campos de entrada são atribuídas seus valores padrão. A atribuição de valores padrão é descrita na Seção 13.6, “Valores padrão de tipo de dados”.

* Atribuir `NULL` (ou seja, `\N`) a uma coluna que não é `NULL` resulta na atribuição do valor padrão implícito para o tipo de dados da coluna. Os valores padrão implícitos são descritos na Seção 13.6, “Valores padrão de tipo de dados”.

* Valores inválidos produzem avisos em vez de erros e são convertidos para o valor "mais próximo" válido para o tipo de dados da coluna. Exemplos:

  + Um valor como `'x'` para uma coluna numérica resulta em conversão para 0.

+ Um valor numérico ou temporal fora do intervalo é recortado para o ponto final mais próximo do intervalo para o tipo de dado da coluna.

+ Um valor inválido para uma coluna `DATETIME`, `DATE` ou `TIME` é inserido como o valor padrão implícito, independentemente da configuração do modo SQL `NO_ZERO_DATE`. O valor padrão implícito é o valor apropriado “zero” para o tipo (`'0000-00-00 00:00:00'`, `'0000-00-00'`, ou `'00:00:00'`). Veja a Seção 13.2, “Tipos de Dados de Data e Hora”.

* `LOAD DATA` interpreta um valor de campo vazio de maneira diferente de um campo ausente:

  + Para tipos de string, a coluna é definida como a string vazia.
  + Para tipos numéricos, a coluna é definida como `0`.

  + Para tipos de data e hora, a coluna é definida como o valor apropriado “zero” para o tipo. Veja a Seção 13.2, “Tipos de Dados de Data e Hora”.

  Estes são os mesmos valores que resultam se você atribuir explicitamente uma string vazia a um tipo de string, numérico ou de data ou hora explicitamente em uma instrução `INSERT` ou `UPDATE`.

Colunas `TIMESTAMP` são definidas para a data e hora atuais apenas se houver um valor `NULL` para a coluna (ou seja, `\N`) e a coluna não for declarada para permitir valores `NULL`, ou se o valor padrão da coluna `TIMESTAMP` for o timestamp atual e ele for omitido da lista de campos quando uma lista de campos é especificada.

`LOAD DATA` considera todo o input como strings, então você não pode usar valores numéricos para colunas `ENUM` ou `SET` da maneira que pode com instruções `INSERT`. Todos os valores `ENUM` e `SET` devem ser especificados como strings.

Valores `BIT` não podem ser carregados diretamente usando notação binária (por exemplo, `b'011010'`). Para contornar isso, use a cláusula `SET` para remover o `b'` inicial e o `'` final e realizar uma conversão de base 2 para base 10 para que o MySQL carregue os valores na coluna `BIT` corretamente:

```
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

Para valores `BIT` na notação binária `0b` (por exemplo, `0b011010`), use esta cláusula `SET` em vez disso para remover o prefixo `0b`:

```
SET b = CAST(CONV(MID(@var1, 3, LENGTH(@var1)-2), 2, 10) AS UNSIGNED)
```

#### Suporte a Tabelas Partidas

O `LOAD DATA` suporta a seleção explícita de partições usando a cláusula `PARTITION` com uma lista de um ou mais nomes separados por vírgula de partições, subpartições ou ambos. Quando esta cláusula é usada, se houver linhas no arquivo que não puderem ser inseridas em nenhuma das partições ou subpartições nomeadas na lista, a instrução falha com o erro Encontrou uma linha que não corresponde ao conjunto de partições fornecido. Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

#### Considerações de Concorrência

Com o modificador `LOW_PRIORITY`, a execução da instrução `LOAD DATA` é adiada até que nenhum outro cliente esteja lendo da tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

Com o modificador `CONCURRENT` e uma tabela `MyISAM` que satisfaça a condição para inserções concorrentes (ou seja, não contenha blocos livres no meio), outros threads podem recuperar dados da tabela enquanto o `LOAD DATA` está sendo executado. Este modificador afeta o desempenho do `LOAD DATA` um pouco, mesmo que nenhum outro thread esteja usando a tabela ao mesmo tempo.

#### Informações sobre o Resultado da Instrução

Quando a instrução `LOAD DATA` termina, ela retorna uma string de informações no seguinte formato:

```
Records: 1  Deleted: 0  Skipped: 0  Warnings: 0
```

As advertências ocorrem nas mesmas circunstâncias que quando os valores são inseridos usando a instrução `INSERT` (consulte a Seção 15.2.7, “Instrução INSERT”), exceto que o `LOAD DATA` também gera advertências quando há poucos ou muitos campos na linha de entrada.

Você pode usar `SHOW WARNINGS` para obter uma lista das primeiras `max_error_count` avisos como informações sobre o que deu errado. Veja a Seção 15.7.7.43, “Instrução SHOW WARNINGS”.

Se você estiver usando a API C, pode obter informações sobre a instrução chamando a função `mysql_info()`. Veja mysql_info().

#### Considerações sobre a Replicação

`LOAD DATA` é considerado inseguro para a replicação baseada em instruções. Se você usar `LOAD DATA` com `binlog_format=STATEMENT`, cada réplica na qual as alterações devem ser aplicadas cria um arquivo temporário contendo os dados. Esse arquivo temporário não é criptografado, mesmo que a criptografia do log binário esteja ativa na fonte. Se a criptografia for necessária, use o formato de log binário baseado em linhas ou misto, para o qual as réplicas não criam o arquivo temporário. Para mais informações sobre a interação entre `LOAD DATA` e a replicação, veja a Seção 19.5.1.20, “Replicação e LOAD DATA”.

#### Tópicos Diversos

No Unix, se você precisar que `LOAD DATA` leia de uma pipe, você pode usar a seguinte técnica (o exemplo carrega uma lista do diretório `/` na tabela `db1.t1`):

```
mkfifo /mysql/data/db1/ls.dat
chmod 666 /mysql/data/db1/ls.dat
find / -ls > /mysql/data/db1/ls.dat &
mysql -e "LOAD DATA INFILE 'ls.dat' INTO TABLE t1" db1
```

Aqui, você deve executar o comando que gera os dados a serem carregados e os comandos **mysql** em terminais separados ou executar o processo de geração de dados em segundo plano (como mostrado no exemplo anterior). Se você não fizer isso, a pipe bloqueia até que os dados sejam lidos pelo processo **mysql**.