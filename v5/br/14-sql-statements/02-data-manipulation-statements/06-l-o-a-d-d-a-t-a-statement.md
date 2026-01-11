### 13.2.6 Declaração de carregamento de dados

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

A instrução `LOAD DATA` lê linhas de um arquivo de texto em uma tabela em alta velocidade. O arquivo pode ser lido do host do servidor ou do host do cliente, dependendo se o modificador `LOCAL` é fornecido. `LOCAL` também afeta a interpretação dos dados e o tratamento de erros.

`LOAD DATA` é o complemento de `SELECT ... INTO OUTFILE`. (Veja Seção 13.2.9.1, “Instrução SELECT ... INTO”.) Para escrever dados de uma tabela em um arquivo, use `SELECT ... INTO OUTFILE`. Para ler o arquivo de volta para uma tabela, use `LOAD DATA`. A sintaxe das cláusulas `FIELDS` e `LINES` é a mesma para ambas as instruções.

O utilitário **mysqlimport** oferece outra maneira de carregar arquivos de dados; ele funciona enviando uma instrução `LOAD DATA` para o servidor. Veja Seção 4.5.5, “mysqlimport — Um Programa de Importação de Dados”.

Para obter informações sobre a eficiência de `INSERT` em comparação com `LOAD DATA` e sobre a aceleração de `LOAD DATA`, consulte Seção 8.2.4.1, “Otimização de Instruções INSERT”.

- Operação LOCAL versus OPERAÇÃO NÃO LOCAL
- Conjunto de caracteres do arquivo de entrada
- Localização do arquivo de entrada
- Requisitos de segurança
- Tratamento de Erros e Chave Duplicada
- Gerenciamento de índice
- Manipulação de Campo e Linha
- Especificação da Lista de Colunas
- Pré-processamento de entrada
- Atribuição de valor de coluna
- Suporte para tabelas particionadas
- Considerações sobre Concorrência
- Informações sobre o resultado da declaração
- Considerações sobre replicação
- Tópicos Diversos

#### Operação Não LOCAL versus OPERAÇÃO LOCAL

O modificador `LOCAL` afeta esses aspectos da instrução `LOAD DATA` em comparação com a operação sem `LOCAL`:

- Ele altera a localização esperada do arquivo de entrada; veja Localização do arquivo de entrada.

- Ele altera os requisitos de segurança da declaração; veja Requisitos de Segurança.

- A menos que `REPLACE` também seja especificado, `LOCAL` tem o mesmo efeito que o modificador `IGNORE` na interpretação do conteúdo do arquivo de entrada e no tratamento de erros; veja Tratamento de Erros e Duplicatas de Chave e Atribuição de Valor de Coluna.

`LOCAL` só funciona se o servidor e o cliente estiverem configurados para permitir isso. Por exemplo, se o **mysqld** foi iniciado com a variável de sistema `**local_infile** desativada, `LOCAL\` produz um erro. Veja Seção 6.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

#### Conjunto de caracteres do arquivo de entrada

O nome do arquivo deve ser fornecido como uma string literal. No Windows, especifique barras invertidas em nomes de caminho como barras inclinadas ou barras invertidas duplas. O servidor interpreta o nome do arquivo usando o conjunto de caracteres indicado pela variável de sistema `character_set_filesystem`.

Por padrão, o servidor interpreta o conteúdo do arquivo usando o conjunto de caracteres indicado pela variável de sistema `character_set_database`. Se o conteúdo do arquivo usar um conjunto de caracteres diferente desse padrão, é uma boa ideia especificar esse conjunto de caracteres usando a cláusula `CHARACTER SET`. Um conjunto de caracteres de `binary` especifica “sem conversão”.

As opções `SET NAMES` e a configuração de `character_set_client` não afetam a interpretação do conteúdo do arquivo.

`LOAD DATA` interpreta todos os campos do arquivo como tendo o mesmo conjunto de caracteres, independentemente dos tipos de dados das colunas para as quais os valores dos campos são carregados. Para uma interpretação adequada do arquivo, você deve garantir que ele foi escrito com o conjunto de caracteres correto. Por exemplo, se você escrever um arquivo de dados com **mysqldump -T** ou emitir uma declaração `SELECT ... INTO OUTFILE` em **mysql**, certifique-se de usar a opção `--default-character-set` para escrever a saída no conjunto de caracteres a ser usado quando o arquivo for carregado com `LOAD DATA`.

Nota

Não é possível carregar arquivos de dados que utilizam o conjunto de caracteres `ucs2`, `utf16`, `utf16le` ou `utf32`.

#### Localização do arquivo de entrada

Essas regras determinam a localização do arquivo de entrada `LOAD DATA`:

- Se `LOCAL` não for especificado, o arquivo deve estar localizado no host do servidor. O servidor lê o arquivo diretamente, localizando-o da seguinte forma:

  - Se o nome do arquivo for um nome de caminho absoluto, o servidor o usa conforme fornecido.

  - Se o nome do arquivo for um nome de caminho relativo com componentes iniciais, o servidor procura o arquivo em relação ao diretório de dados.

  - Se o nome do arquivo não tiver componentes no início, o servidor procura o arquivo no diretório do banco de dados padrão.

- Se `LOCAL` for especificado, o arquivo deve estar localizado no host do cliente. O programa cliente lê o arquivo, localizando-o da seguinte forma:

  - Se o nome do arquivo for um nome de caminho absoluto, o programa cliente o usa conforme fornecido.

  - Se o nome do arquivo for um nome de caminho relativo, o programa cliente procura o arquivo em relação ao diretório de invocação.

  Quando o `LOCAL` é usado, o programa cliente lê o arquivo e envia seu conteúdo para o servidor. O servidor cria uma cópia do arquivo no diretório onde armazena arquivos temporários. Veja Seção B.3.3.5, “Onde o MySQL Armazena Arquivos Temporários”. A falta de espaço suficiente para a cópia neste diretório pode fazer com que a instrução `LOAD DATA LOCAL` falhe.

As regras que não são `LOCAL` significam que o servidor lê um arquivo chamado `./myfile.txt` em relação ao seu diretório de dados, enquanto lê um arquivo chamado `myfile.txt` do diretório de banco de dados do banco de dados padrão. Por exemplo, se a seguinte instrução `LOAD DATA` for executada enquanto `db1` é o banco de dados padrão, o servidor lê o arquivo `data.txt` do diretório de banco de dados para `db1`, mesmo que a instrução carregue explicitamente o arquivo em uma tabela no banco de dados `db2`:

```sql
LOAD DATA INFILE 'data.txt' INTO TABLE db2.my_table;
```

#### Requisitos de segurança

Para uma operação de carregamento que não seja `LOCAL`, o servidor lê um arquivo de texto localizado no host do servidor, portanto, esses requisitos de segurança devem ser atendidos:

- Você deve ter o privilégio `FILE`. Veja Seção 6.2.2, “Privilégios Fornecidos pelo MySQL”.

- A operação está sujeita à configuração da variável de sistema `secure_file_priv`:

  - Se o valor da variável for um nome de diretório não vazio, o arquivo deve estar localizado nesse diretório.

  - Se o valor da variável estiver vazio (o que é inseguro), o arquivo só precisa ser legível pelo servidor.

Para uma operação de carregamento `LOCAL`, o programa cliente lê um arquivo de texto localizado no host do cliente. Como o conteúdo do arquivo é enviado pela conexão do cliente para o servidor, usar `LOCAL` é um pouco mais lento do que quando o servidor acessa o arquivo diretamente. Por outro lado, você não precisa do privilégio `FILE` e o arquivo pode estar localizado em qualquer diretório que o programa cliente possa acessar.

#### Tratamento de chaves duplicadas e erros

Os modificadores `REPLACE` e `IGNORE` controlam o tratamento de novas (entrada) linhas que duplicam linhas de tabela existentes com valores de chave única (`PRIMARY KEY` ou valores de índice `UNIQUE`):

- Com `REPLACE`, novas linhas que têm o mesmo valor que um valor de chave única em uma linha existente substituem a linha existente. Veja Seção 13.2.8, “Instrução REPLACE”.

- Com `IGNORE`, novas linhas que duplicam uma linha existente com um valor de chave único são descartadas. Para mais informações, consulte O efeito de IGNORE na execução da declaração.

A menos que `REPLACE` também seja especificado, o modificador `LOCAL` tem o mesmo efeito que `IGNORE`. Isso ocorre porque o servidor não tem como interromper a transmissão do arquivo durante a operação.

Se nenhum dos parâmetros `REPLACE`, `IGNORE` ou `LOCAL` for especificado, ocorrerá um erro quando um valor de chave duplicado for encontrado, e o restante do arquivo de texto será ignorado.

Além de afetar o tratamento de chaves duplicadas, conforme descrito acima, `IGNORE` e `LOCAL` também afetam o tratamento de erros:

- Quando não são especificados `IGNORE` ou `LOCAL`, os erros de interpretação de dados encerram a operação.

- Quando `IGNORE`—ou `LOCAL` sem `REPLACE`—é especificado, erros de interpretação de dados tornam-se avisos e a operação de carregamento continua, mesmo que o modo SQL seja restritivo. Para exemplos, consulte Atribuição de Valor de Coluna.

#### Gerenciamento de índice

Para ignorar as restrições de chave estrangeira durante a operação de carregamento, execute uma instrução `SET foreign_key_checks = 0` antes de executar `LOAD DATA`.

Se você usar `LOAD DATA` em uma tabela `MyISAM` vazia, todos os índices não únicos são criados em um lote separado (como no caso de `REPAIR TABLE`). Normalmente, isso torna `LOAD DATA` muito mais rápido quando você tem muitos índices. Em alguns casos extremos, você pode criar os índices ainda mais rápido, desabilitando-os com `ALTER TABLE ... DISABLE KEYS` antes de carregar o arquivo na tabela e recriar os índices com `ALTER TABLE ... ENABLE KEYS` após carregar o arquivo. Veja Seção 8.2.4.1, “Otimizando Instruções INSERT”.

#### Manipulação de campo e linha

Tanto para as instruções `LOAD DATA` quanto `SELECT ... INTO OUTFILE`, a sintaxe das cláusulas `FIELDS` e `LINES` é a mesma. Ambas as cláusulas são opcionais, mas `FIELDS` deve preceder `LINES` se ambas forem especificadas.

Se você especificar uma cláusula `FIELDS`, cada uma de suas subcláusulas (`TERMINATED BY`, `[OPTIONALLY] ENCLOSED BY` e `ESCAPED BY`) também é opcional, exceto que você deve especificar pelo menos uma delas. Os argumentos dessas cláusulas podem conter apenas caracteres ASCII.

Se você não especificar nenhuma cláusula `FIELDS` ou `LINES`, os valores padrão serão os mesmos se você tivesse escrito o seguinte:

```sql
FIELDS TERMINATED BY '\t' ENCLOSED BY '' ESCAPED BY '\\'
LINES TERMINATED BY '\n' STARTING BY ''
```

O backslash é o caractere de escape do MySQL dentro das strings nas instruções SQL. Assim, para especificar um backslash literal, você deve especificar dois backslashes para que o valor seja interpretado como um único backslash. As sequências de escape `'\t'` e `'\n'` especificam caracteres de tabulação e nova linha, respectivamente.

Em outras palavras, os defeitos fazem com que `LOAD DATA` aja da seguinte maneira ao ler a entrada:

- Procure os limites das linhas em novas linhas.

- Não ignore nenhum prefixo de linha.

- Divida as linhas em campos em guias.

- Não espere que os campos estejam dentro de quaisquer caracteres de citação.

- Interprete caracteres precedidos pelo caractere de escape `\` como sequências de escape. Por exemplo, `\t`, `\n` e `\\` significam tabulação, nova linha e barra invertida, respectivamente. Consulte a discussão sobre `FIELDS ESCAPED BY` mais adiante para obter a lista completa das sequências de escape.

Por outro lado, os defeitos fazem com que `SELECT ... INTO OUTFILE` funcione da seguinte maneira ao escrever a saída:

- Escreva separadores de tabulação entre os campos.

- Não inclua campos dentro de quaisquer caracteres de citação.

- Use `\` para escapar de instâncias de tabulação, nova linha ou `\` que ocorrem dentro dos valores do campo.

- Escreva novas linhas no final das linhas.

Nota

Para um arquivo de texto gerado em um sistema Windows, a leitura adequada do arquivo pode exigir `LINHAS TERMINADAS POR '\r\n'`, pois os programas do Windows geralmente usam dois caracteres como finalizador de linha. Alguns programas, como o **WordPad**, podem usar `\r` como finalizador de linha ao gravar arquivos. Para ler esses arquivos, use `LINHAS TERMINADAS POR '\r'`.

Se todas as linhas de entrada tiverem um prefixo comum que você deseja ignorar, você pode usar `LINHAS COMEÇANDO COM 'prefix_string'` para ignorar o prefixo *e qualquer coisa antes dele*. Se uma linha não incluir o prefixo, toda a linha é ignorada. Suponha que você emita a seguinte declaração:

```sql
LOAD DATA INFILE '/tmp/test.txt' INTO TABLE test
  FIELDS TERMINATED BY ','  LINES STARTING BY 'xxx';
```

Se o arquivo de dados tiver a seguinte aparência:

```sql
xxx"abc",1
something xxx"def",2
"ghi",3
```

As linhas resultantes são `("abc",1)` e `("def",2)`. A terceira linha do arquivo é ignorada porque não contém o prefixo.

A cláusula `IGNORE número LINES` pode ser usada para ignorar linhas no início do arquivo. Por exemplo, você pode usar `IGNORE 1 LINES` para pular uma linha de cabeçalho inicial que contém os nomes das colunas:

```sql
LOAD DATA INFILE '/tmp/test.txt' INTO TABLE test IGNORE 1 LINES;
```

Quando você usa `SELECT ... INTO OUTFILE` em conjunto com `LOAD DATA` para escrever dados de um banco de dados em um arquivo e, em seguida, ler o arquivo de volta para o banco de dados mais tarde, as opções de manipulação de campos e linhas para ambas as instruções devem corresponder. Caso contrário, o `LOAD DATA` não interpreta corretamente o conteúdo do arquivo. Suponha que você use `SELECT ... INTO OUTFILE` para escrever um arquivo com campos delimitados por vírgulas:

```sql
SELECT * INTO OUTFILE 'data.txt'
  FIELDS TERMINATED BY ','
  FROM table2;
```

Para ler o arquivo separado por vírgula, a declaração correta é:

```sql
LOAD DATA INFILE 'data.txt' INTO TABLE table2
  FIELDS TERMINATED BY ',';
```

Se, em vez disso, você tentasse ler o arquivo com a declaração mostrada a seguir, isso não funcionaria, pois instrui o `LOAD DATA` a procurar tabulações entre campos:

```sql
LOAD DATA INFILE 'data.txt' INTO TABLE table2
  FIELDS TERMINATED BY '\t';
```

O resultado provável é que cada linha de entrada seria interpretada como um único campo.

`LOAD DATA` pode ser usado para ler arquivos obtidos de fontes externas. Por exemplo, muitos programas podem exportar dados no formato de valores separados por vírgula (CSV), de modo que as linhas tenham campos separados por vírgulas e encerrados entre aspas duplas, com uma linha inicial de nomes de colunas. Se as linhas desse arquivo forem terminadas por pares de retorno de carro/nova linha, a declaração mostrada aqui ilustra as opções de manipulação de campos e linhas que você usaria para carregar o arquivo:

```sql
LOAD DATA INFILE 'data.txt' INTO TABLE tbl_name
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\r\n'
  IGNORE 1 LINES;
```

Se os valores de entrada não estiverem necessariamente entre aspas, use `OPÇÕES` antes da opção `ENCLOSED BY`.

Qualquer uma das opções de manipulação de campos ou linhas pode especificar uma string vazia (`''`). Se não for vazia, os valores `FIELDS [OPÇÕES] ENCLOSED BY` e `FIELDS ESCAPED BY` devem ser um único caractere. Os valores `FIELDS TERMINATED BY`, `LINES STARTING BY` e `LINES TERMINATED BY` podem ser mais de um caractere. Por exemplo, para escrever linhas terminadas por pares de retorno de carro/reinício de linha, ou para ler um arquivo contendo tais linhas, especifique uma cláusula `LINES TERMINATED BY '\r\n'`.

Para ler um arquivo contendo piadas separadas por linhas que consistem em `%%`, você pode fazer isso

```sql
CREATE TABLE jokes
  (a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  joke TEXT NOT NULL);
LOAD DATA INFILE '/tmp/jokes.txt' INTO TABLE jokes
  FIELDS TERMINATED BY ''
  LINES TERMINATED BY '\n%%\n' (joke);
```

`FIELDS [OPÇÕES] ENCASADOS POR` controla a citação de campos. Para saída (`SELECT ... INTO OUTFILE`), se você omitir a palavra `OPÇÕES`, todos os campos são enquadrados pelo caractere `ENCASADOS POR`. Um exemplo de tal saída (usando uma vírgula como delimitador de campo) é mostrado aqui:

```sql
"1","a string","100.20"
"2","a string containing a , comma","102.20"
"3","a string containing a \" quote","102.20"
"4","a string containing a \", quote and comma","102.20"
```

Se você especificar `OPTIONALLY`, o caractere `ENCLOSED BY` é usado apenas para encerrar valores de colunas que têm um tipo de dados de string (como `CHAR`, `BINARY`, `TEXT` ou `ENUM`):

```sql
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a \" quote",102.20
4,"a string containing a \", quote and comma",102.20
```

Ocorrência do caractere `ENCLOSED BY` dentro de um valor de campo é escapado prefixando-o com o caractere `ESCAPED BY`. Além disso, se você especificar um valor `ESCAPED BY` vazio, é possível gerar inadvertidamente uma saída que não pode ser lida corretamente pelo `LOAD DATA`. Por exemplo, a saída anterior mostrada anteriormente apareceria da seguinte forma se o caractere de escape fosse vazio. Observe que o segundo campo na quarta linha contém uma vírgula após a citação, que (erradamente) parece terminar o campo:

```sql
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a " quote",102.20
4,"a string containing a ", quote and comma",102.20
```

Para a entrada, o caractere `ENCLOSED BY`, se presente, é removido das extremidades dos valores de campo. (Isso é verdadeiro independentemente de a opção `OPTIONALLY` ser especificada; a `OPTIONALLY` não tem efeito na interpretação da entrada.) Ocorrências do caractere `ENCLOSED BY`, precedido pelo caractere `ESCAPED BY`, são interpretadas como parte do valor atual do campo.

Se o campo começar com o caractere `ENCLOSED BY`, as ocorrências desse caractere são reconhecidas como o final de um valor de campo apenas se forem seguidas pela sequência de campo ou linha `TERMINATED BY`. Para evitar ambiguidade, as ocorrências do caractere `ENCLOSED BY` dentro de um valor de campo podem ser duplicadas e são interpretadas como uma única ocorrência do caractere. Por exemplo, se `ENCLOSED BY '"'` for especificado, as aspas são tratadas conforme mostrado aqui:

```sql
"The ""BIG"" boss"  -> The "BIG" boss
The "BIG" boss      -> The "BIG" boss
The ""BIG"" boss    -> The ""BIG"" boss
```

`FIELDS ESCAPED BY` controla como ler ou escrever caracteres especiais:

- Para entrada, se o caractere `FIELDS ESCAPED BY` não estiver vazio, as ocorrências desse caractere são removidas e o caractere seguinte é lido literalmente como parte do valor de um campo. Algumas sequências de dois caracteres que são exceções, onde o primeiro caractere é o caractere de escape. Essas sequências estão mostradas na tabela a seguir (usando `\` para o caractere de escape). As regras para o tratamento de `NULL` são descritas mais adiante nesta seção.

  <table summary="Sequências de dois caracteres, nas quais o primeiro caractere (a \) é o caractere de escape."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Personagem</th> <th>Sequência de fuga</th> </tr></thead><tbody><tr> <td><code>\0</code></td> <td>Um caractere ASCII NUL (<code>X'00'</code>)</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere de retrocesso</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova linha (linefeed)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere de retorno de carro</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação.</td> </tr><tr> <td><code>\Z</code></td> <td>ASCII 26 (Ctrl+Z)</td> </tr><tr> <td><code>\N</code></td> <td>NULL</td> </tr></tbody></table>

  Para obter mais informações sobre a sintaxe de escape de `\` (barra invertida), consulte Seção 9.1.1, “Literal de String”.

  Se o caractere `FIELDS ESCAPED BY` estiver vazio, a interpretação da sequência de escape não ocorrerá.

- Em relação à saída, se o caractere `FIELDS ESCAPED BY` não estiver vazio, ele é usado para prefixar os caracteres seguintes na saída:

  - O caractere `FIELDS ESCAPED BY`.

  - O caractere `FIELDS [OPÇÕES] ENCLOSED BY`.

  - O primeiro caractere dos valores `FIELDS TERMINATED BY` e `LINES TERMINATED BY`, se o caractere `ENCLOSED BY` estiver vazio ou não especificado.

  - ASCII `0` (o que é realmente escrito após o caractere de escape é ASCII `0`, não um byte de valor zero).

  Se o caractere `FIELDS ESCAPED BY` estiver vazio, nenhum caractere será escavado e `NULL` será exibido como `NULL`, não como `\N`. Provavelmente não é uma boa ideia especificar um caractere de escape vazio, especialmente se os valores dos campos em seus dados contiverem algum dos caracteres da lista que acabamos de fornecer.

Em certos casos, as opções de manipulação de campo e linha interagem:

- Se `LINHAS TERMINADAS POR` for uma string vazia e `CAMPOS TERMINADOS POR` for não-vazio, as linhas também serão terminadas com `CAMPOS TERMINADOS POR`.

- Se os valores `FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` estiverem vazios (`''`), será usado um formato de linha fixa (não delimitado). Com o formato de linha fixa, não são usados delimitadores entre os campos (mas você ainda pode ter um finalizador de linha). Em vez disso, os valores das colunas são lidos e escritos usando uma largura de campo o suficiente para conter todos os valores do campo. Para `TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT` e `BIGINT`, as larguras dos campos são, respectivamente, 4, 6, 8, 11 e 20, independentemente da largura de exibição declarada.

  `LINHAS TERMINADAS POR` ainda é usado para separar as linhas. Se uma linha não contiver todos os campos, o resto das colunas será definido com seus valores padrão. Se você não tiver um finalizador de linha, deve definir isso para `''`. Nesse caso, o arquivo de texto deve conter todos os campos para cada linha.

  O formato de linha fixa também afeta o tratamento dos valores `NULL`, conforme descrito mais adiante.

  Nota

  O formato de tamanho fixo não funciona se você estiver usando um conjunto de caracteres multibyte.

O tratamento de valores `NULL` varia de acordo com as opções `FIELDS` e `LINES` em uso:

- Para os valores padrão `FIELDS` e `LINES`, `NULL` é escrito como um valor de campo de `\N` para saída e um valor de campo de `\N` é lido como `NULL` para entrada (assumindo que o caractere `ESCAPED BY` é `\`).

- Se `CAMPOS ENCASADOS POR` não estiver vazio, um campo que contenha a palavra literal `NULL` como seu valor é lido como um valor `NULL`. Isso difere da palavra `NULL` enquadrada entre os caracteres `CAMPOS ENCASADOS POR`, que é lida como a string `'NULL'`.

- Se `CAMPOS ESCAPADOS POR` estiver vazio, `NULL` é escrito como a palavra `NULL`.

- Com o formato de linha fixa (que é usado quando `FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` estão ambos vazios), `NULL` é escrito como uma string vazia. Isso faz com que tanto os valores `NULL` quanto as strings vazias na tabela sejam indistinguíveis quando escritos no arquivo, porque ambos são escritos como strings vazias. Se você precisar ser capaz de distinguir os dois ao ler o arquivo novamente, você não deve usar o formato de linha fixa.

Uma tentativa de carregar `NULL` em uma coluna `NOT NULL` produz um aviso ou um erro de acordo com as regras descritas em Atribuição de Valor de Coluna.

Alguns casos não são suportados pelo `LOAD DATA`:

- Linhas de tamanho fixo (`FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` ambos vazios) e colunas de tipo `BLOB` ou `TEXT`.

- Se você especificar um separador que é o mesmo ou um prefixo de outro, o `LOAD DATA` não consegue interpretar a entrada corretamente. Por exemplo, a seguinte cláusula `FIELDS` causaria problemas:

  ```sql
  FIELDS TERMINATED BY '"' ENCLOSED BY '"'
  ```

- Se `FIELDS ESCAPED BY` estiver vazio, um valor de campo que contém uma ocorrência de `FIELDS ENCLOSED BY` ou `LINES TERMINATED BY` seguida do valor `FIELDS TERMINATED BY` faz com que `LOAD DATA` pare de ler um campo ou linha muito cedo. Isso acontece porque `LOAD DATA` não consegue determinar corretamente onde o valor do campo ou linha termina.

#### Especificação da Lista de Colunas

O exemplo a seguir carrega todas as colunas da tabela `persondata`:

```sql
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata;
```

Por padrão, quando não é fornecida uma lista de colunas no final da instrução `LOAD DATA`, as linhas de entrada devem conter um campo para cada coluna da tabela. Se você deseja carregar apenas algumas colunas de uma tabela, especifique uma lista de colunas:

```sql
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata
(col_name_or_user_var [, col_name_or_user_var] ...);
```

Você também deve especificar uma lista de colunas se a ordem dos campos no arquivo de entrada for diferente da ordem das colunas na tabela. Caso contrário, o MySQL não saberá como combinar os campos de entrada com as colunas da tabela.

#### Pré-processamento de entrada

Cada instância de *`col_name_or_user_var`* na sintaxe de `LOAD DATA` é ou o nome de uma coluna ou uma variável de usuário. Com variáveis de usuário, a cláusula `SET` permite que você realize transformações de pré-processamento em seus valores antes de atribuir o resultado às colunas.

As variáveis de usuário na cláusula `SET` podem ser usadas de várias maneiras. O exemplo a seguir usa a primeira coluna de entrada diretamente para o valor de `t1.column1` e atribui a segunda coluna de entrada a uma variável de usuário que é submetida a uma operação de divisão antes de ser usada para o valor de `t1.column2`:

```sql
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, @var1)
  SET column2 = @var1/100;
```

A cláusula `SET` pode ser usada para fornecer valores que não são derivados do arquivo de entrada. A seguinte declaração define `column3` para a data e hora atuais:

```sql
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, column2)
  SET column3 = CURRENT_TIMESTAMP;
```

Você também pode descartar um valor de entrada atribuindo-o a uma variável do usuário e não atribuindo a variável a nenhuma coluna da tabela:

```sql
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, @dummy, column2, @dummy, column3);
```

O uso da lista de colunas/variáveis e da cláusula `SET` está sujeito às seguintes restrições:

- As atribuições na cláusula `SET` devem ter apenas nomes de colunas do lado esquerdo dos operadores de atribuição.

- Você pode usar subconsultas no lado direito das atribuições de `SET`. Uma subconsulta que retorna um valor para ser atribuído a uma coluna pode ser apenas uma subconsulta escalar. Além disso, você não pode usar uma subconsulta para selecionar da tabela que está sendo carregada.

- As linhas ignoradas por uma cláusula `IGNORE number LINES` não são processadas para a lista de colunas/variáveis ou a cláusula `SET`.

- As variáveis do usuário não podem ser usadas ao carregar dados com formato de linha fixa, porque as variáveis do usuário não têm largura de exibição.

#### Atribuição de valor à coluna

Para processar uma linha de entrada, `LOAD DATA` a divide em campos e usa os valores de acordo com a lista de colunas/variáveis e a cláusula `SET`, se estiverem presentes. Em seguida, a linha resultante é inserida na tabela. Se houver gatilhos `BEFORE INSERT` ou `AFTER INSERT` para a tabela, eles são ativados antes ou depois de inserir a linha, respectivamente.

A interpretação dos valores de campo e a atribuição às colunas da tabela dependem desses fatores:

- O modo SQL (o valor da variável de sistema `sql_mode`). O modo pode ser não restritivo ou restritivo de várias maneiras. Por exemplo, o modo SQL estrito pode ser ativado, ou o modo pode incluir valores como `NO_ZERO_DATE` ou `NO_ZERO_IN_DATE`.

- Presença ou ausência dos modificadores `IGNORE` e `LOCAL`.

Esses fatores combinam para produzir uma interpretação de dados restritiva ou não restritiva pelo `LOAD DATA`:

- A interpretação dos dados é restritiva se o modo SQL for restritivo e nenhum dos modificadores `IGNORE` ou `LOCAL` for especificado. Os erros encerram a operação de carregamento.

- A interpretação dos dados não é restritiva se o modo SQL não for restritivo ou se o modificador `IGNORE` ou `LOCAL` for especificado. (Em particular, qualquer um desses modificadores, se especificado, *anula* um modo SQL restritivo.) Os erros se tornam avisos e a operação de carregamento continua.

A interpretação restritiva dos dados utiliza essas regras:

- Muitos ou poucos campos resultam em um erro.

- Atribuir `NULL` (ou seja, `\N`) a uma coluna que não é `NULL` resulta em um erro.

- Um valor fora do intervalo para o tipo de dados da coluna resulta em um erro.

- Valores inválidos produzem erros. Por exemplo, um valor como `'x'` para uma coluna numérica resulta em um erro, não em conversão para 0.

Em contraste, a interpretação de dados não restritiva utiliza essas regras:

- Se uma linha de entrada tiver muitos campos, os campos extras são ignorados e o número de avisos é incrementado.

- Se uma linha de entrada tiver poucos campos, as colunas que não possuem campos de entrada receberão seus valores padrão. A atribuição de valores padrão é descrita em Seção 11.6, “Valores padrão de tipo de dados”.

- Atribuir `NULL` (ou seja, `\N`) a uma coluna que não é `NULL` resulta na atribuição do valor padrão implícito para o tipo de dados da coluna. Os valores padrão implícitos são descritos em Seção 11.6, “Valores padrão de tipo de dados”.

- Valores inválidos produzem avisos em vez de erros e são convertidos para o valor “mais próximo” válido para o tipo de dados da coluna. Exemplos:

  - Um valor como `'x'` para uma coluna numérica resulta em conversão para 0.

  - Um valor numérico ou temporal fora do intervalo é recortado para o ponto final mais próximo do intervalo para o tipo de dados da coluna.

  - Um valor inválido para uma coluna `DATETIME`, `DATE` ou `TIME` é inserido como o valor padrão implícito, independentemente da configuração do modo SQL `NO_ZERO_DATE`. O valor padrão implícito é o valor apropriado “zero” para o tipo (`'0000-00-00 00:00:00'`, `'0000-00-00'`, ou `'00:00:00'`). Veja Seção 11.2, “Tipos de Dados de Data e Hora”.

- `LOAD DATA` interpreta um valor de campo vazio de maneira diferente de um campo ausente:

  - Para os tipos de string, a coluna é definida como uma string vazia.

  - Para os tipos numéricos, a coluna é definida como `0`.

  - Para os tipos de data e hora, a coluna é definida com o valor apropriado de “zero” para o tipo. Consulte Seção 11.2, “Tipos de dados de data e hora”.

  Estes são os mesmos valores que resultam se você atribuir uma string vazia explicitamente a um tipo de string, numérico, data ou hora explicitamente em uma instrução `INSERT` ou `UPDATE`.

As colunas `[TIMESTAMP]` (data e hora) são definidas para a data e hora atuais apenas se houver um valor `NULL` para a coluna (ou seja, `\N`) e a coluna não for declarada para permitir valores `NULL`, ou se o valor padrão da coluna `[TIMESTAMP]` (data e hora) for o timestamp atual e ele for omitido da lista de campos quando uma lista de campos é especificada.

`LOAD DATA` considera todos os dados como strings, portanto, você não pode usar valores numéricos para as colunas `ENUM` (enum.html) ou `SET` (set.html) da mesma maneira que pode fazer com as instruções `INSERT` (insert.html). Todos os valores de `ENUM` (enum.html) e `SET` (set.html) devem ser especificados como strings.

Os valores de `BIT` não podem ser carregados diretamente usando notação binária (por exemplo, `b'011010'`). Para contornar isso, use a cláusula `SET` para remover o caractere `b'` no início e o caractere `'` no final e realize uma conversão de base-2 para base-10 para que o MySQL carregue os valores na coluna `BIT` corretamente:

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

Para valores de ``BIT` na notação binária `0b`(por exemplo,`0b011010`), use esta cláusula `SET`em vez disso para remover o`0b\` inicial:

```sql
SET b = CAST(CONV(MID(@var1, 3, LENGTH(@var1)-2), 2, 10) AS UNSIGNED)
```

#### Suporte para Tabelas Partidas

`LOAD DATA` suporta a seleção explícita de partições usando a cláusula `PARTITION` com uma lista de um ou mais nomes de partições, subpartições ou ambos, separados por vírgula. Quando essa cláusula é usada, se houver linhas no arquivo que não puderem ser inseridas em nenhuma das partições ou subpartições listadas, a instrução falhará com o erro "Encontrou uma linha que não corresponde ao conjunto de partições fornecido". Para mais informações e exemplos, consulte Seção 22.5, "Seleção de Partições".

Para tabelas particionadas que utilizam motores de armazenamento que empregam bloqueios de tabela, como `MyISAM`, `LOAD DATA` não pode eliminar quaisquer bloqueios de partição. Isso não se aplica a tabelas que utilizam motores de armazenamento que empregam bloqueio de nível de linha, como `InnoDB`. Para mais informações, consulte Seção 22.6.4, “Particionamento e Bloqueio”.

#### Considerações sobre Concorrência

Com o modificador `LOW_PRIORITY`, a execução da instrução `LOAD DATA` é adiada até que nenhum outro cliente esteja lendo da tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

Com o modificador `CONCURRENT` e uma tabela `MyISAM` que atende à condição para inserções concorrentes (ou seja, não contém blocos livres no meio), outros threads podem recuperar dados da tabela enquanto o `LOAD DATA` está sendo executado. Esse modificador afeta um pouco o desempenho do `LOAD DATA`, mesmo que nenhum outro thread esteja usando a tabela ao mesmo tempo.

#### Informações sobre o resultado da declaração

Quando a instrução `LOAD DATA` terminar, ela retorna uma string de informações no seguinte formato:

```sql
Records: 1  Deleted: 0  Skipped: 0  Warnings: 0
```

As advertências ocorrem nas mesmas circunstâncias em que os valores são inseridos usando a instrução `INSERT` (veja Seção 13.2.5, “Instrução INSERT”), exceto que `LOAD DATA` também gera advertências quando há muitos ou poucos campos na linha de entrada.

Você pode usar `SHOW WARNINGS` para obter uma lista dos primeiros `[max_error_count`]\(server-system-variables.html#sysvar_max_error_count) avisos como informações sobre o que deu errado. Veja Seção 13.7.5.40, “Instrução SHOW WARNINGS”.

Se você estiver usando a API C, pode obter informações sobre a declaração chamando a função `mysql_info()`. Veja mysql_info().

#### Considerações sobre a replicação

Para informações sobre `LOAD DATA` em relação à replicação, consulte Seção 16.4.1.18, “Replicação e LOAD DATA”.

#### Tópicos variados

No Unix, se você precisar de `LOAD DATA` para ler de uma tubulação, você pode usar a seguinte técnica (o exemplo carrega uma lista do diretório `/` na tabela `db1.t1`):

```sql
mkfifo /mysql/data/db1/ls.dat
chmod 666 /mysql/data/db1/ls.dat
find / -ls > /mysql/data/db1/ls.dat &
mysql -e "LOAD DATA INFILE 'ls.dat' INTO TABLE t1" db1
```

Aqui, você deve executar o comando que gera os dados a serem carregados e os comandos **mysql** em terminais separados ou executar o processo de geração de dados em segundo plano (como mostrado no exemplo anterior). Se você não fizer isso, o tubo fica bloqueado até que os dados sejam lidos pelo processo **mysql**.
