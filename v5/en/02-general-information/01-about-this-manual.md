## 1.1 Sobre Este Manual

Este é o Manual de Referência para o Sistema de Banco de Dados MySQL, versão 5.7, até a *release* 5.7.44. Diferenças entre as versões menores do MySQL 5.7 são observadas neste texto com referência aos números de *release* (5.7.*`x`*). Para informações sobre licença, consulte os Avisos Legais.

Este manual não se destina ao uso com versões mais antigas do *software* MySQL devido às muitas diferenças funcionais e outras entre o MySQL 5.7 e versões anteriores. Se você estiver usando uma *release* anterior do *software* MySQL, consulte o manual apropriado. Por exemplo, o *MySQL 5.6 Reference Manual* cobre a série 5.6 de *releases* do *software* MySQL.

Se você estiver usando o MySQL 8.0, consulte o *MySQL 8.0 Reference Manual*.

Como este manual serve como referência, ele não fornece instruções gerais sobre SQL ou conceitos de banco de dados relacionais. Ele também não ensina como usar seu sistema operacional ou interpretador de linha de comando.

O Software de Banco de Dados MySQL está em constante desenvolvimento, e o Manual de Referência também é atualizado frequentemente. A versão mais recente do manual está disponível online em formato pesquisável em https://dev.mysql.com/doc/. Outros formatos também estão disponíveis, incluindo versões HTML e PDF para download.

Se você tiver dúvidas sobre como usar o MySQL, junte-se ao [MySQL Community Slack](https://mysqlcommunity.slack.com/). Se você tiver sugestões sobre adições ou correções ao próprio manual, envie-as para <http://www.mysql.com/company/contact/>.

### Convenções Tipográficas e de Sintaxe

Este manual utiliza certas convenções tipográficas:

* `Text in this style` é usado para comandos SQL; nomes de database, table e column; listagens de programa e código-fonte; e variáveis de ambiente. Exemplo: “Para recarregar as *grant tables*, use o comando `FLUSH PRIVILEGES`.”

* **`Text in this style`** indica a entrada que você digita em exemplos.

* **Text in this style** indica os nomes de programas e *scripts* executáveis, sendo exemplos o **mysql** (o programa cliente de linha de comando MySQL) e o **mysqld** (o executável do servidor MySQL).

* *`Text in this style`* é usado para entrada variável pela qual você deve substituir um valor de sua própria escolha.

* *Text in this style* é usado para ênfase.
* **Text in this style** é usado em cabeçalhos de tabela e para transmitir ênfase especialmente forte.

* `Text in this style` é usado para indicar uma opção de programa que afeta como o programa é executado, ou que fornece informações necessárias para que o programa funcione de uma certa maneira. *Exemplo*: “A opção `--host` (forma abreviada `-h`) informa ao programa cliente **mysql** o *hostname* ou endereço IP do servidor MySQL ao qual ele deve se conectar”.

* Nomes de arquivos e diretórios são escritos assim: “O arquivo global `my.cnf` está localizado no diretório `/etc`.”

* Sequências de caracteres são escritas assim: “Para especificar um *wildcard*, use o caractere ‘`%`’.”

Quando comandos ou declarações são prefixados por um *prompt*, usamos estes:

```sql
$> type a command here
#> type a command as root here
C:\> type a command here (Windows only)
mysql> type a mysql statement here
```

Os comandos são emitidos no seu interpretador de comandos. No Unix, este é tipicamente um programa como **sh**, **csh** ou **bash**. No Windows, o programa equivalente é **command.com** ou **cmd.exe**, geralmente executado em uma janela de console. Comandos prefixados por `mysql` são emitidos no cliente de linha de comando **mysql**.

Nota: Ao inserir um comando ou declaração mostrado em um exemplo, não digite o *prompt* exibido no exemplo.

Em algumas áreas, sistemas diferentes podem ser distinguidos uns dos outros para mostrar que os comandos devem ser executados em dois ambientes distintos. Por exemplo, ao trabalhar com replicação, os comandos podem ser prefixados com `source` e `replica`:

```sql
source> type a mysql statement on the replication source here
replica> type a mysql statement on the replica here
```

Nomes de Database, table e column frequentemente precisam ser substituídos em comandos. Para indicar que tal substituição é necessária, este manual usa *`db_name`*, *`tbl_name`* e *`col_name`*. Por exemplo, você pode ver um comando como este:

```sql
mysql> SELECT col_name FROM db_name.tbl_name;
```

Isso significa que, se você fosse inserir um comando semelhante, forneceria seus próprios nomes de database, table e column, talvez assim:

```sql
mysql> SELECT author_name FROM biblio_db.author_list;
```

As palavras-chave SQL não são sensíveis a maiúsculas/minúsculas e podem ser escritas em qualquer caixa. Este manual utiliza maiúsculas.

Em descrições de sintaxe, colchetes (“`[`” e “`]`”) indicam palavras ou cláusulas opcionais. Por exemplo, no seguinte comando, `IF EXISTS` é opcional:

```sql
DROP TABLE [IF EXISTS] tbl_name
```

Quando um elemento de sintaxe consiste em várias alternativas, as alternativas são separadas por barras verticais (“`|`”). Quando um membro de um conjunto de escolhas *pode* ser escolhido, as alternativas são listadas dentro de colchetes (“`[`” e “`]`”):

```sql
TRIM(BOTH | LEADING | TRAILING] [remstr] FROM] str)
```

Quando um membro de um conjunto de escolhas *deve* ser escolhido, as alternativas são listadas dentro de chaves (“`{`” e “`}`”):

```sql
{DESCRIBE | DESC} tbl_name [col_name | wild]
```

Uma elipse (`...`) indica a omissão de uma seção de um comando, tipicamente para fornecer uma versão mais curta de uma sintaxe mais complexa. Por exemplo, `SELECT ... INTO OUTFILE` é uma abreviação para a forma do comando `SELECT` que possui uma cláusula `INTO OUTFILE` seguindo outras partes do comando.

Uma elipse também pode indicar que o elemento de sintaxe precedente de um comando pode ser repetido. No exemplo a seguir, múltiplos valores *`reset_option`* podem ser fornecidos, com cada um após o primeiro precedido por vírgulas:

```sql
RESET reset_option [,reset_option] ...
```

Os comandos para definir variáveis de *shell* são mostrados usando a sintaxe do Bourne shell. Por exemplo, a sequência para definir a variável de ambiente `CC` e executar o comando **configure** se parece com isto na sintaxe do Bourne shell:

```sql
$> CC=gcc ./configure
```

Se você estiver usando **csh** ou **tcsh**, você deve emitir os comandos de forma ligeiramente diferente:

```sql
$> setenv CC gcc
$> ./configure
```

### Autoria do Manual

Os arquivos-fonte do Manual de Referência são escritos no formato DocBook XML. A versão HTML e outros formatos são produzidos automaticamente, principalmente usando os *stylesheets* XSL DocBook. Para informações sobre DocBook, consulte <http://docbook.org/>.

Este manual foi escrito originalmente por David Axmark e Michael “Monty” Widenius. Ele é mantido pela Equipe de Documentação MySQL, composta por Edward Gilmore, Sudharsana Gomadam, Kim seong Loh, Garima Sharma, Carlos Ortiz, Daniel So e Jon Stephens.