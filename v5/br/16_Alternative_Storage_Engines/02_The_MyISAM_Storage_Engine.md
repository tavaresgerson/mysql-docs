## 15.2 O Motor de Armazenamento MyISAM

`MyISAM` é baseado no motor de armazenamento mais antigo (e não mais disponível) `ISAM`, mas possui muitas extensões úteis.

**Tabela 15.2 Características do Motor de Armazenamento MyISAM**

<table frame="box" rules="all" summary="Features supported by the MyISAM storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Support</th> </tr></thead><tbody><tr><td><strong>Índices de árvore B</strong></td> <td>Yes</td> </tr><tr><td><strong>Backup/recuperação em ponto no tempo</strong>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Yes</td> </tr><tr><td><strong>Suporte para banco de dados em cluster</strong></td> <td>No</td> </tr><tr><td><strong>Índices agrupados</strong></td> <td>No</td> </tr><tr><td><strong>Dados comprimidos</strong></td> <td>Yes (Compressed MyISAM tables are supported only when using the compressed row format. Tables using the compressed row format with MyISAM are read only.)</td> </tr><tr><td><strong>Caches de dados</strong></td> <td>No</td> </tr><tr><td><strong>Dados criptografados</strong></td> <td>Yes (Implemented in the server via encryption functions.)</td> </tr><tr><td><strong>Suporte para chave estrangeira</strong></td> <td>No</td> </tr><tr><td><strong>Indekses de pesquisa de texto completo</strong></td> <td>Yes</td> </tr><tr><td><strong>Suporte ao tipo de dados geográficos</strong></td> <td>Yes</td> </tr><tr><td><strong>Suporte para indexação geospacial</strong></td> <td>Yes</td> </tr><tr><td><strong>Indekses de hash</strong></td> <td>No</td> </tr><tr><td><strong>Cache do índice</strong></td> <td>Yes</td> </tr><tr><td><strong>Granularidade de bloqueio</strong></td> <td>Table</td> </tr><tr><td><strong>MVCC</strong></td> <td>No</td> </tr><tr><td><strong>Suporte para replicação</strong>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Yes</td> </tr><tr><td><strong>Limites de armazenamento</strong></td> <td>256TB</td> </tr><tr><td><strong>Índices T-tree</strong></td> <td>No</td> </tr><tr><td><strong>Transações</strong></td> <td>No</td> </tr><tr><td><strong>Atualize as estatísticas do dicionário de dados</strong></td> <td>Yes</td> </tr></tbody></table>

Cada tabela `MyISAM` é armazenada em disco em três arquivos. Os arquivos têm nomes que começam com o nome da tabela e têm uma extensão para indicar o tipo de arquivo. Um arquivo `.frm` armazena o formato da tabela. O arquivo de dados tem uma extensão `.MYD` (`MYData`). O arquivo de índice tem uma extensão `.MYI` (`MYIndex`).

Para especificar explicitamente que você deseja uma tabela `MyISAM`, indique isso com uma opção de tabela `ENGINE`:

```sql
CREATE TABLE t (i INT) ENGINE = MYISAM;
```

Em MySQL 5.7, normalmente é necessário usar `ENGINE` para especificar o mecanismo de armazenamento `MyISAM`, pois `InnoDB` é o mecanismo padrão.

Você pode verificar ou reparar as tabelas `MyISAM` com o cliente **mysqlcheck** ou o utilitário **myisamchk**. Você também pode comprimir as tabelas `MyISAM` com **myisampack** para ocupar muito menos espaço. Veja a Seção 4.5.3, “mysqlcheck — Um programa de manutenção de tabela”, a Seção 4.6.3, “myisamchk — Utilitário de manutenção de tabela MyISAM”, e a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM comprimidas e somente de leitura”.

As tabelas `MyISAM` têm as seguintes características:

* Todos os valores dos dados são armazenados com o byte de baixo primeiro. Isso torna os dados independentes da máquina e do sistema operacional. Os únicos requisitos para a portabilidade binária são que a máquina use inteiros assinados com complemento de dois e o formato de ponto flutuante IEEE. Esses requisitos são amplamente utilizados entre as máquinas convencionais. A compatibilidade binária pode não ser aplicável a sistemas embutidos, que às vezes têm processadores peculiares.

Não há penalidade significativa de velocidade para armazenar dados com o byte de menor tamanho primeiro; os bytes em uma string de tabela normalmente não estão alinhados e leva pouco mais de processamento para ler um byte não alinhado em ordem inversa do que em ordem reversa. Além disso, o código no servidor que busca os valores das colunas não é crítico em termos de tempo em comparação com outros códigos.

* Todos os valores das teclas numéricas são armazenados com o byte alto primeiro para permitir uma melhor compressão de índice.

* Arquivos grandes (até 63 bits de comprimento de arquivo) são suportados em sistemas de arquivos e sistemas operacionais que suportam arquivos grandes.

* Há um limite de (232) 2 (1,844E+19) strings em uma tabela `MyISAM`.

* O número máximo de índices por tabela `MyISAM` é de 64.

O número máximo de colunas por índice é 16.

* O comprimento máximo da chave é de 1000 bytes. Isso também pode ser alterado alterando a fonte e recompilando. No caso de uma chave mais longa que 250 bytes, um tamanho de bloco de chave maior que o padrão de 1024 bytes é usado.

* Quando as strings são inseridas em ordem ordenada (como quando você está usando uma coluna `AUTO_INCREMENT`, o índice é dividido de modo que o nó superior contenha apenas uma chave. Isso melhora a utilização do espaço no índice.

* O manuseio interno de uma coluna `AUTO_INCREMENT` por tabela é suportado. A coluna `MyISAM` atualiza automaticamente essa coluna para operações de `INSERT` e `UPDATE`. Isso torna as colunas `AUTO_INCREMENT` mais rápidas (pelo menos 10%). Os valores no topo da sequência não são reutilizados após serem excluídos. (Quando uma coluna `AUTO_INCREMENT` é definida como a última coluna de um índice de múltiplas colunas, a reutilização de valores excluídos do topo de uma sequência ocorre.) O valor de `AUTO_INCREMENT` pode ser redefinido com `ALTER TABLE` ou **myisamchk**.

As strings de tamanho dinâmico são muito menos fragmentadas ao misturar excluções com atualizações e inserções. Isso é feito combinando automaticamente blocos excluídos adjacentes e estendendo blocos se o próximo bloco for excluído.

* `MyISAM` suporta inserções concorrentes: Se uma tabela não tiver blocos livres no meio do arquivo de dados, você pode `INSERT` inserir novas strings nela ao mesmo tempo em que outros threads estão lendo da tabela. Um bloco livre pode ocorrer como resultado da remoção de strings ou da atualização de uma string de comprimento dinâmico com mais dados do que seu conteúdo atual. Quando todos os blocos livres são consumidos (preenchidos), as inserções futuras tornam-se concorrentes novamente. Veja a Seção 8.11.3, “Inserções Concorrentes”.

* Você pode colocar o arquivo de dados e o arquivo de índice em diretórios diferentes em dispositivos físicos diferentes para obter mais velocidade com as opções da tabela `DATA DIRECTORY` e `INDEX DIRECTORY` para [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Veja a Seção 13.1.18, “Declaração CREATE TABLE”.

As colunas `BLOB` e `TEXT` podem ser indexadas.

* Os valores de `NULL` são permitidos em colunas indexadas. Isso ocupa de 0 a 1 byte por chave.

* Cada coluna de caracteres pode ter um conjunto de caracteres diferente. Veja o Capítulo 10, * Conjuntos de caracteres, Colagens, Unicode*.

* Há uma bandeira no arquivo de índice `MyISAM` que indica se a tabela foi fechada corretamente. Se o `mysqld` for iniciado com a variável de sistema `myisam_recover_options` definida, as tabelas `MyISAM` são verificadas automaticamente quando abertas e são reparadas se a tabela não foi fechada corretamente.

* **myisamchk** marca as tabelas como verificadas se você executá-lo com a opção `--update-state`. **myisamchk --fast** verifica apenas as tabelas que não têm essa marca.

* **myisamchk --analyze** armazena estatísticas para porções de chaves, bem como para chaves inteiras.

* **myisampack** pode embalar as colunas `BLOB` e `VARCHAR`.

`MyISAM` também suporta os seguintes recursos:

* Suporte para um verdadeiro tipo `VARCHAR`; uma coluna `VARCHAR` começa com um comprimento armazenado em um ou dois bytes.

* As tabelas com colunas `VARCHAR` podem ter comprimento de string fixo ou dinâmico.

* A soma das comprimentos das colunas `VARCHAR` e `CHAR` em uma tabela pode ser de até 64 KB.

* Limites de comprimento arbitrário `UNIQUE`.

### Recursos adicionais

* Um fórum dedicado ao motor de armazenamento `MyISAM` está disponível em <https://forums.mysql.com/list.php?21>.

### 15.2.1 Opções de inicialização do MyISAM

As seguintes opções para `mysqld` podem ser usadas para alterar o comportamento das tabelas `MyISAM`. Para informações adicionais, consulte a Seção 5.1.6, “Opções de comando do servidor”.

**Tabela 15.3 Opção MyISAM e Referência de Variável**

<table frame="box" rules="all" summary="Reference for MyISAM command-line options and system variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Name</th> <th>Cmd-Line</th> <th>Option File</th> <th>System Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dynamic</th> </tr></thead><tbody><tr><th>bulk_insert_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>concurrent_insert</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>delay_key_write</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>have_rtree_keys</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>key_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>log-isam</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>myisam-block-size</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>myisam_data_pointer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>myisam_max_sort_file_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>myisam_mmap_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>myisam_recover_options</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>myisam_repair_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>myisam_sort_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>myisam_stats_method</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th>myisam_use_mmap</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>tmp_table_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr></tbody></table>

As seguintes variáveis de sistema afetam o comportamento das tabelas de `MyISAM`. Para informações adicionais, consulte a Seção 5.1.7, “Variáveis do sistema do servidor”.

* `bulk_insert_buffer_size`

O tamanho do cache de árvore usado na otimização de inserção em massa.

Nota

Este é um limite *por thread*!

* `delay_key_write=ALL`

Não descarte buffers-chave entre os escritos para qualquer tabela `MyISAM`.

Nota

Se você fizer isso, não deve acessar as tabelas `MyISAM` de outro programa (como de outro servidor MySQL ou com **myisamchk**) quando as tabelas estiverem em uso. Fazer isso arrisca a corrupção do índice. O uso de `--external-locking` não elimina esse risco.

* `myisam_max_sort_file_size`

O tamanho máximo do arquivo temporário que o MySQL é permitido usar ao recriar um índice `MyISAM` (durante `REPAIR TABLE`, `ALTER TABLE` ou `LOAD DATA`). Se o tamanho do arquivo fosse maior que esse valor, o índice é criado usando a cache de chave em vez disso, o que é mais lento. O valor é dado em bytes.

* `myisam_recover_options=mode`

Defina o modo para recuperação automática de tabelas do `MyISAM` que foram afetadas por falhas.

* `myisam_sort_buffer_size`

Defina o tamanho do buffer usado ao recuperar tabelas.

A recuperação automática é ativada se você iniciar `mysqld` com a variável de sistema `myisam_recover_options` definida. Neste caso, quando o servidor abre uma tabela `MyISAM`, ele verifica se a tabela está marcada como quebrada ou se a variável de contagem de abertura para a tabela não for 0 e você estiver executando o servidor com bloqueio externo desativado. Se uma dessas condições for verdadeira, o seguinte acontece:

* O servidor verifica a tabela em busca de erros. * Se o servidor encontrar um erro, ele tenta realizar uma rápida reparação da tabela (com classificação e sem recarregar o arquivo de dados).

* Se a reparação falhar devido a um erro no arquivo de dados (por exemplo, um erro de chave duplicada), o servidor tenta novamente, desta vez recriando o arquivo de dados.

* Se a reparação ainda falhar, o servidor tenta novamente com o método de opção de reparação antiga (escrever string por string sem classificação). Esse método deve ser capaz de reparar qualquer tipo de erro e tem requisitos de espaço em disco baixos.

Se a recuperação não conseguir recuperar todas as strings de declarações anteriormente concluídas e você não especificar `FORCE` no valor da variável de sistema `myisam_recover_options`, a reparação automática interrompe com uma mensagem de erro no log de erro:

```sql
Error: Couldn't repair table: test.g00pages
```

Se você especificar `FORCE`, um aviso como este é escrito em vez disso:

```sql
Warning: Found 344 of 354 rows when repairing ./test/g00pages
```

Se o valor de recuperação automática incluir `BACKUP`, o processo de recuperação cria arquivos com nomes na forma de `tbl_name-datetime.BAK`. Você deve ter um script **cron** que mova automaticamente esses arquivos dos diretórios do banco de dados para mídia de backup.

### 15.2.2 Espaço necessário para as chaves

As tabelas `MyISAM` utilizam índices de árvore B. Você pode calcular aproximadamente o tamanho do arquivo do índice como `(key_length+4)/0.67`, somando todas as chaves. Isso é para o caso pior, quando todas as chaves são inseridas em ordem ordenada e a tabela não tem nenhuma chave comprimida.

Os índices de cadeia são comprimidos em termos de espaço. Se a primeira parte do índice for uma cadeia, ela também é comprimida por prefixo. A compressão de espaço torna o arquivo do índice menor do que o valor máximo se uma coluna de cadeia tiver muitos espaços finais ou se for uma coluna `VARCHAR` que não é usada sempre na extensão completa. A compressão por prefixo é usada em chaves que começam com uma cadeia. A compressão por prefixo ajuda se houver muitas cadeias com um prefixo idêntico.

Nas tabelas do `MyISAM`, você também pode prefixar os números da compressão, especificando a opção da tabela `PACK_KEYS=1` ao criar a tabela. Os números são armazenados com o byte alto primeiro, então isso ajuda quando você tem muitos números inteiros que têm um prefixo idêntico.

### 15.2.3 Formas de armazenamento de tabelas MyISAM

`MyISAM` suporta três formatos de armazenamento diferentes. Dois deles, o formato fixo e o dinâmico, são escolhidos automaticamente dependendo do tipo de colunas que você está usando. O terceiro, o formato comprimido, só pode ser criado com o utilitário **myisampack** (consulte a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM comprimidas e somente de leitura”).

Quando você usa `CREATE TABLE` ou `ALTER TABLE` para uma tabela que não tem colunas `BLOB` ou `TEXT`, você pode forçar o formato da tabela para `FIXED` ou `DYNAMIC` com a opção de tabela `ROW_FORMAT`.

Consulte a Seção 13.1.18, “Instrução CREATE TABLE”, para obter informações sobre `ROW_FORMAT`.

Você pode descomprimir (descompactar) tabelas comprimidas do formato `MyISAM` usando **myisamchk** `--unpack`; consulte a Seção 4.6.3, “myisamchk — Ferramenta de manutenção de tabelas MyISAM”, para mais informações.

#### 15.2.3.1 Características de tabela estática (com comprimento fixo)

O formato estático é o padrão para as tabelas `MyISAM`. É usado quando a tabela não contém colunas de comprimento variável (`VARCHAR`, `VARBINARY`, `BLOB` ou `TEXT`). Cada string é armazenada usando um número fixo de bytes.

Dos três formatos de armazenamento `MyISAM`, o formato estático é o mais simples e seguro (menos sujeito a corrupção). Também é o mais rápido dos formatos em disco, devido à facilidade com que as strings no arquivo de dados podem ser encontradas no disco: Para procurar uma string com base em um número de string no índice, multiplique o número de string pelo comprimento da string para calcular a posição da string. Além disso, ao digitalizar uma tabela, é muito fácil ler um número constante de strings em cada operação de leitura em disco.

A segurança é evidenciada se o seu computador falhar enquanto o servidor MySQL está escrevendo em um arquivo de formato fixo `MyISAM`. Neste caso, o **myisamchk** pode facilmente determinar onde cada string começa e termina, de modo que geralmente possa recuperar todas as strings, exceto a parcialmente escrita. Os índices da tabela `MyISAM` podem sempre ser reconstruídos com base nas strings de dados.

Nota

O formato de string de comprimento fixo só está disponível para tabelas sem as colunas `BLOB` ou `TEXT`. Criar uma tabela com essas colunas com uma cláusula explícita `ROW_FORMAT` não gera erro ou aviso; a especificação do formato é ignorada.

As tabelas com formato estático têm essas características:

As colunas `CHAR` e `VARCHAR` são preenchidas com espaços até o tamanho especificado da coluna, embora o tipo da coluna não seja alterado. As colunas `BINARY` e `VARBINARY` são preenchidas com `0x00` bytes até o tamanho da coluna.

* As colunas `NULL` exigem espaço adicional na string para registrar se seus valores são `NULL`. Cada coluna `NULL` leva um bit extra, arredondado para o próximo byte.

* Muito rápido. * Fácil de armazenar. * Fácil de reconstruir após um acidente, porque as strings estão localizadas em posições fixas.

* A reorganização não é necessária, a menos que você exclua um grande número de strings e queira devolver espaço livre no disco ao sistema operacional. Para fazer isso, use `OPTIMIZE TABLE` ou **myisamchk -r**.

* Geralmente exigem mais espaço em disco do que as tabelas de formato dinâmico.
* O comprimento de string esperado em bytes para strings de tamanho estático é calculado usando a seguinte expressão:

  ```sql
  row length = 1
               + (sum of column lengths)
               + (number of NULL columns + delete_flag + 7)/8
               + (number of variable-length columns)
  ```

*`delete_flag`* é 1 para tabelas com formato de string estático. As tabelas estáticas utilizam um bit no registro da string para uma bandeira que indica se a string foi excluída. *`delete_flag`* é 0 para tabelas dinâmicas, porque a bandeira é armazenada no cabeçalho dinâmico da string.

#### 15.2.3.2 Características dinâmicas da tabela

O formato de armazenamento dinâmico é usado se uma tabela `MyISAM` contiver colunas de comprimento variável (`VARCHAR`, `VARBINARY`, `BLOB` ou `TEXT`), ou se a tabela foi criada com a opção da tabela `ROW_FORMAT=DYNAMIC`.

O formato dinâmico é um pouco mais complexo do que o formato estático, porque cada string tem um cabeçalho que indica o seu comprimento. Uma string pode se fragmentar (armazenada em partes não contíguas) quando é feita mais longa como resultado de uma atualização.

Você pode usar `OPTIMIZE TABLE` ou **myisamchk -r** para defragmentar uma tabela. Se você tem colunas de comprimento fixo que você acessa ou altera frequentemente em uma tabela que também contém algumas colunas de comprimento variável, pode ser uma boa ideia mover as colunas de comprimento variável para outras tabelas apenas para evitar fragmentação.

As tabelas com formato dinâmico têm essas características:

* Todas as colunas de texto são dinâmicas, exceto aquelas com comprimento menor que quatro.

* Cada string é precedida por uma bitmap que indica quais colunas contêm a string vazia (para colunas de texto) ou zero (para colunas numéricas). Isso não inclui colunas que contêm valores de `NULL`. Se uma coluna de texto tiver um comprimento de zero após a remoção de espaço final, ou uma coluna numérica tiver um valor de zero, ela é marcada na bitmap e não é salva no disco. As strings não vazias são salvas como um byte de comprimento mais o conteúdo da string.

* As colunas `NULL` exigem espaço adicional na string para registrar se seus valores são `NULL`. Cada coluna `NULL` leva um bit extra, arredondado para o próximo byte.

* Geralmente é necessário muito menos espaço em disco do que para tabelas de comprimento fixo.

* Cada string usa apenas o espaço necessário. No entanto, se uma string se tornar maior, ela é dividida em tantas partes quanto for necessário, resultando em fragmentação da string. Por exemplo, se você atualizar uma string com informações que estendem o comprimento da string, a string se torna fragmentada. Neste caso, você pode ter que executar `OPTIMIZE TABLE` ou **myisamchk -r** de tempos em tempos para melhorar o desempenho. Use **myisamchk -ei** para obter estatísticas da tabela.

* Mais difíceis de reconstruir do que tabelas em formato estático após um acidente, porque as strings podem ser fragmentadas em muitas partes e os links (fragmentos) podem estar faltando.

* O comprimento da string esperado para strings de tamanho dinâmico é calculado usando a seguinte expressão:

  ```sql
  3
  + (number of columns + 7) / 8
  + (number of char columns)
  + (packed size of numeric columns)
  + (length of strings)
  + (number of NULL columns + 7) / 8
  ```

Há uma penalidade de 6 bytes para cada link. Uma string dinâmica é vinculada sempre que uma atualização causa um alargamento da string. Cada novo link tem pelo menos 20 bytes, então o próximo alargamento provavelmente vai no mesmo link. Se não for esse o caso, outro link é criado. Você pode encontrar o número de links usando **myisamchk -ed**. Todos os links podem ser removidos com `OPTIMIZE TABLE` ou **myisamchk -r**.

#### 15.2.3.3 Características da Tabela Compressa

O formato de armazenamento comprimido é um formato somente de leitura que é gerado com a ferramenta **myisampack**. As tabelas comprimidas podem ser descomprimidas com **myisamchk**.

As tabelas compactadas têm as seguintes características:

* As tabelas compactadas ocupam muito pouco espaço em disco. Isso minimiza o uso do disco, o que é útil ao usar discos lentos (como CD-ROMs).

* Cada string é comprimida separadamente, portanto, há muito pouco sobrecarga de acesso. O cabeçalho de uma string ocupa de um a três bytes, dependendo da string maior da tabela. Cada coluna é comprimida de maneira diferente. Geralmente, há uma árvore de Huffman diferente para cada coluna. Alguns dos tipos de compressão são:

Compressão de espaço de sufixo.
Compressão de espaço de prefixo.
Números com um valor de zero são armazenados usando um bit.
Se os valores em uma coluna de número inteiro tiverem um pequeno intervalo, a coluna é armazenada usando o tipo possível menor. Por exemplo, uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (oito bytes) pode ser armazenada como uma coluna `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (um byte) se todos os seus valores estiverem no intervalo de `-128` a `127`.

+ Se uma coluna tiver apenas um pequeno conjunto de valores possíveis, o tipo de dados é convertido em `ENUM`.

+ Uma coluna pode usar qualquer combinação dos tipos de compressão anteriores.

* Pode ser usado para strings de comprimento fixo ou dinâmico.

Nota

Embora uma tabela compactada seja apenas de leitura, e você não possa, portanto, atualizar ou adicionar strings na tabela, as operações de DDL (Data Definition Language) ainda são válidas. Por exemplo, você ainda pode usar `DROP` para descartar a tabela e `TRUNCATE TABLE` para esvaziar a tabela.

### 15.2.4 Problemas com tabelas MyISAM

O formato de arquivo que o MySQL usa para armazenar dados foi amplamente testado, mas sempre existem circunstâncias que podem fazer com que as tabelas do banco de dados se tornem corrompidas. A discussão a seguir descreve como isso pode acontecer e como lidar com isso.

#### 15.2.4.1 Tabelas MyISAM corrompidas

Embora o formato da tabela `MyISAM` seja muito confiável (todas as alterações em uma tabela feitas por uma declaração SQL são escritas antes de a declaração retornar), ainda é possível obter tabelas corrompidas se algum dos seguintes eventos ocorrer:

* O processo `mysqld` é interrompido durante a escrita.

* ocorre uma falha inesperada do computador (por exemplo, o computador é desligado).

* Falhas de hardware. * Você está usando um programa externo (como **myisamchk**) para modificar uma tabela que está sendo modificada pelo servidor ao mesmo tempo.

* Um erro de software no código MySQL ou `MyISAM`.

Os sintomas típicos de uma tabela corrupta são:

* Você recebe o seguinte erro ao selecionar dados da tabela:

  ```sql
  Incorrect key file for table: '...'. Try to repair it
  ```

* As consultas não encontram strings na tabela ou retornam resultados incompletos.

Você pode verificar a saúde de uma tabela `MyISAM` usando a declaração `CHECK TABLE`, e reparar uma tabela `MyISAM` corrompida com `REPAIR TABLE`. Quando o `mysqld` não está em execução, você também pode verificar ou reparar uma tabela com o comando **myisamchk**. Veja a Seção 13.7.2.2, “Declaração CHECK TABLE”, a Seção 13.7.2.5, “Declaração REPARAR TABELA”, e a Seção 4.6.3, “myisamchk — Ferramenta de manutenção de tabela MyISAM”.

Se suas tabelas forem corrompidas com frequência, você deve tentar determinar por que isso está acontecendo. A coisa mais importante a saber é se a tabela foi corrompida como resultado de uma saída inesperada do servidor. Você pode verificar isso facilmente, procurando uma mensagem recente do `restarted mysqld` no log de erro. Se houver tal mensagem, é provável que a corrupção da tabela seja resultado do servidor falhando. Caso contrário, a corrupção pode ter ocorrido durante o funcionamento normal. Isso é um bug. Você deve tentar criar um caso de teste reproduzível que demonstre o problema. Veja a Seção B.3.3.3, “O que fazer se o MySQL continua a falhar”, e a Seção 5.8, “Depuração do MySQL”.

#### 15.2.4.2 Problemas com tabelas que não são fechadas corretamente

Cada arquivo de índice `MyISAM` (arquivo `.MYI`) tem um contador no cabeçalho que pode ser usado para verificar se uma tabela foi fechada corretamente. Se você receber o seguinte aviso do `CHECK TABLE` ou **myisamchk**, isso significa que esse contador saiu de sincronia:

```sql
clients are using or haven't closed the table properly
```

Este aviso não significa necessariamente que a tabela está corrompida, mas você deve, pelo menos, verificar a tabela.

O contador funciona da seguinte forma:

* A primeira vez que uma tabela é atualizada no MySQL, um contador no cabeçalho dos arquivos de índice é incrementado.

* O contador não é alterado durante atualizações adicionais. * Quando a última instância de uma tabela é fechada (porque uma operação `FLUSH TABLES` foi realizada ou porque não há espaço na cache da tabela), o contador é decrementado se a tabela tiver sido atualizada em algum momento.

* Quando você conserta a mesa ou verifica a mesa e descobre que está tudo bem, o contador é zerado.

* Para evitar problemas com a interação com outros processos que podem verificar a tabela, o contador não é decrementado ao fechar se estiver zero.

Em outras palavras, o contador só pode se tornar incorreto nessas condições:

* Uma tabela `MyISAM` é copiada sem emitir primeiro `LOCK TABLES` e `FLUSH TABLES`.

* O MySQL quebrou entre uma atualização e o fechamento final. (A tabela ainda pode estar em ordem, pois o MySQL sempre emite gravações para tudo o que está entre cada declaração.)

* Uma tabela foi modificada por [**myisamchk --recover**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") ou [**myisamchk --update-state**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") ao mesmo tempo em que estava sendo usada por `mysqld`.

* Múltiplos servidores `mysqld` estão usando a tabela e um servidor realizou uma `REPAIR TABLE` ou `CHECK TABLE` na tabela enquanto ela estava sendo usada por outro servidor. Neste cenário, é seguro usar `CHECK TABLE`, embora você possa receber o aviso de outros servidores. No entanto, `REPAIR TABLE` deve ser evitado, pois, quando um servidor substitui o arquivo de dados por um novo, isso não é conhecido pelos outros servidores.

Em geral, é uma má ideia compartilhar um diretório de dados entre vários servidores. Consulte a Seção 5.7, “Executando várias instâncias do MySQL em uma máquina”, para uma discussão adicional.