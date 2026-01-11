## 1.1 Sobre este manual

Este é o Manual de Referência para o Sistema de Banco de Dados MySQL, versão 5.7, até a versão 5.7.44. As diferenças entre as versões menores do MySQL 5.7 são mencionadas neste texto com referência aos números de versão (5.7.*\`x*). Para informações sobre a licença, consulte as Notas Legais.

Este manual não é destinado para uso com versões mais antigas do software MySQL, devido às muitas diferenças funcionais e outras entre o MySQL 5.7 e as versões anteriores. Se você estiver usando uma versão anterior do software MySQL, consulte o manual apropriado. Por exemplo, o *Manual de Referência do MySQL 5.6* cobre as versões da série 5.6 do software MySQL.

Se você estiver usando o MySQL 8.0, consulte o *Manual de Referência do MySQL 8.0*.

Como este manual serve como referência, ele não fornece instruções gerais sobre conceitos de SQL ou bancos de dados relacionais. Além disso, ele não ensina como usar seu sistema operacional ou interpretador de linha de comando.

O software de banco de dados MySQL está em constante desenvolvimento, e o Manual de Referência também é atualizado frequentemente. A versão mais recente do manual está disponível online, em formato pesquisável, em <https://dev.mysql.com/doc/>. Outros formatos também estão disponíveis lá, incluindo versões HTML e PDF para download.

Se você tiver dúvidas sobre o uso do MySQL, junte-se ao [Slack da Comunidade MySQL](https://mysqlcommunity.slack.com/). Se você tiver sugestões sobre adições ou correções no manual em si, envie-as para o <http://www.mysql.com/company/contact/>.

### Convenções de tipografia e sintaxe

Este manual utiliza certas convenções tipográficas:

- `Texto neste estilo` é usado para declarações SQL; nomes de banco de dados, tabelas e colunas; listagens de programas e código-fonte; e variáveis de ambiente. Exemplo: “Para recarregar as tabelas de concessão, use a declaração `FLUSH PRIVILEGES`.”

- **`Texto neste estilo`** indica a entrada que você digita nos exemplos.

- O **texto neste estilo** indica os nomes de programas e scripts executáveis, sendo exemplos **mysql** (o programa cliente de linha de comando do MySQL) e **mysqld** (o programa executável do servidor MySQL).

- *`Texto neste estilo`* é usado para entrada variável para a qual você deve substituir um valor de sua escolha.

- *Texto neste estilo* é usado para ênfase.

- O **texto neste estilo** é usado em cabeçalhos de tabelas e para transmitir uma ênfase especialmente forte.

- `Texto neste estilo` é usado para indicar uma opção de programa que afeta a forma como o programa é executado, ou que fornece informações necessárias para que o programa funcione de uma certa maneira. *Exemplo*: “A opção `--host` (forma abreviada `-h`) informa ao programa cliente **mysql** o nome do host ou o endereço IP do servidor MySQL ao qual ele deve se conectar”.

- Os nomes de arquivos e diretórios são escritos assim: “O arquivo global `my.cnf` está localizado no diretório `/etc`.”

- As sequências de caracteres são escritas assim: “Para especificar um caractere curinga, use o caractere `%`.”

Quando comandos ou declarações são prefixados por um prompt, usamos esses:

```sql
$> type a command here
#> type a command as root here
C:\> type a command here (Windows only)
mysql> type a mysql statement here
```

Os comandos são emitidos no interpretador de comandos. No Unix, isso é tipicamente um programa como **sh**, **csh** ou **bash**. No Windows, o programa equivalente é **command.com** ou **cmd.exe**, tipicamente executado em uma janela de console. As declarações prefixadas com `mysql` são emitidas no cliente de linha de comando **mysql**.

Nota

Ao digitar um comando ou uma declaração mostrada em um exemplo, não digite o prompt mostrado no exemplo.

Em algumas áreas, diferentes sistemas podem ser distinguidos uns dos outros para mostrar que os comandos devem ser executados em dois ambientes diferentes. Por exemplo, ao trabalhar com replicação, os comandos podem ser prefixados com `source` e `replica`:

```sql
source> type a mysql statement on the replication source here
replica> type a mysql statement on the replica here
```

Os nomes de banco de dados, tabelas e colunas frequentemente precisam ser substituídos em declarações. Para indicar que essa substituição é necessária, este manual usa *`db_name`*, *`tbl_name`* e *`col_name`*. Por exemplo, você pode ver uma declaração como esta:

```sql
mysql> SELECT col_name FROM db_name.tbl_name;
```

Isso significa que, se você inserir uma declaração semelhante, você fornecerá seus próprios nomes de banco de dados, tabela e coluna, talvez assim:

```sql
mysql> SELECT author_name FROM biblio_db.author_list;
```

As palavras-chave do SQL não são sensíveis ao maiúsculas e podem ser escritas em qualquer caso. Este manual usa maiúsculas.

Nas descrições sintáticas, os colchetes (`[` e `]`) indicam palavras ou cláusulas opcionais. Por exemplo, na seguinte declaração, `IF EXISTS` é opcional:

```sql
DROP TABLE [IF EXISTS] tbl_name
```

Quando um elemento sintático consiste em várias alternativas, as alternativas são separadas por barras verticais (`|`). Quando um membro de um conjunto de escolhas *pode* ser escolhido, as alternativas são listadas entre colchetes (`[` e`]`):

```sql
TRIM(BOTH | LEADING | TRAILING] [remstr] FROM] str)
```

Quando um membro de um conjunto de opções *deve* ser escolhido, as alternativas são listadas entre chaves (“`{`” e “`}`”):

```sql
{DESCRIBE | DESC} tbl_name [col_name | wild]
```

Uma elipse (`...`) indica a omissão de uma seção de uma declaração, geralmente para fornecer uma versão mais curta de uma sintaxe mais complexa. Por exemplo, `SELECT ... INTO OUTFILE` é uma abreviação da forma da instrução `SELECT` que tem uma cláusula `INTO OUTFILE` após outras partes da declaração.

Uma elipse também pode indicar que o elemento sintático anterior de uma declaração pode ser repetido. No exemplo a seguir, vários valores de `reset_option` podem ser fornecidos, com cada um deles após o primeiro precedido por vírgulas:

```sql
RESET reset_option [,reset_option] ...
```

Os comandos para definir variáveis de shell são mostrados usando a sintaxe da shell Bourne. Por exemplo, a sequência para definir a variável de ambiente `CC` e executar o comando **configure** tem a seguinte aparência na sintaxe da shell Bourne:

```sql
$> CC=gcc ./configure
```

Se você estiver usando **csh** ou **tcsh**, você deve emitir comandos de maneira um pouco diferente:

```sql
$> setenv CC gcc
$> ./configure
```

### Autoria Manual

Os arquivos de fonte do Manual de Referência são escritos no formato DocBook XML. A versão HTML e outros formatos são produzidos automaticamente, principalmente usando as folhas de estilo DocBook XSL. Para informações sobre o DocBook, consulte <http://docbook.org/>

Este manual foi originalmente escrito por David Axmark e Michael “Monty” Widenius. Ele é mantido pela Equipe de Documentação do MySQL, composta por Edward Gilmore, Sudharsana Gomadam, Kim seong Loh, Garima Sharma, Carlos Ortiz, Daniel So e Jon Stephens.
