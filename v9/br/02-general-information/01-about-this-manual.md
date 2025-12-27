## 1.1 Sobre este Manual

Este é o Manual de Referência para o Sistema de Banco de Dados MySQL, versão 9.5, até a versão 9.5.0. As diferenças entre as versões menores do MySQL 9.5 são mencionadas neste texto com referência aos números de versão (9.5.*`x`*). Para informações sobre a licença, consulte as Notas Legais.

Este manual não é destinado para uso com versões mais antigas do software MySQL devido às muitas diferenças funcionais e outras entre o MySQL 9.5 e as versões anteriores. Se você estiver usando uma versão anterior do software MySQL, consulte o manual apropriado. Por exemplo, o Manual de Referência do MySQL 8.0 cobre a série de correções de bugs do MySQL 8.0.

Como este manual serve como referência, ele não fornece instruções gerais sobre SQL ou conceitos de banco de dados relacionais. Também não ensina como usar seu sistema operacional ou interpretador de linha de comando.

O Software de Banco de Dados MySQL está em constante desenvolvimento, e o Manual de Referência também é atualizado frequentemente. A versão mais recente do manual está disponível online em formato pesquisável em https://dev.mysql.com/doc/. Outros formatos também estão disponíveis lá, incluindo versões HTML e PDF para download.

O código-fonte do MySQL em si contém documentação interna escrita usando o Doxygen. O conteúdo gerado pelo Doxygen está disponível em https://dev.mysql.com/doc/index-other.html. Também é possível gerar esse conteúdo localmente a partir de uma distribuição de fonte MySQL usando as instruções na Seção 2.8.10, “Gerando Conteúdo de Documentação Doxygen do MySQL”.

Se você tiver dúvidas sobre o uso do MySQL, junte-se ao [Slack da Comunidade MySQL](https://mysqlcommunity.slack.com/). Se você tiver sugestões sobre adições ou correções no próprio manual, envie-as para o <http://www.mysql.com/company/contact/>.

### Convenções de Tipografia e Sintaxe

Este manual usa certas convenções de tipografia:

* `Texto neste estilo` é usado para declarações SQL; nomes de banco de dados, tabelas e colunas; listagens de programas e código-fonte; e variáveis de ambiente. Exemplo: “Para recarregar as tabelas de concessão, use a declaração `FLUSH PRIVILEGES`.”

* **`Texto neste estilo`** indica a entrada que você digita nos exemplos.

* **`Texto neste estilo`** indica os nomes de programas executáveis e scripts, sendo os exemplos **mysql** (o programa cliente de linha de comando do MySQL) e **mysqld** (o executável do servidor MySQL).

* *`Texto neste estilo`* é usado para entrada de variáveis para as quais você deve substituir um valor de sua escolha.

* *`Texto neste estilo`* é usado para ênfase.
* **`Texto neste estilo`** é usado em cabeçalhos de tabelas e para transmitir ênfase especialmente forte.

* `Texto neste estilo` é usado para indicar uma opção de programa que afeta como o programa é executado, ou que fornece informações necessárias para o programa funcionar de certa maneira. *Exemplo*: “A opção `--host` (forma abreviada `-h`) informa ao programa cliente **mysql** o nome do host ou endereço IP do servidor MySQL ao qual ele deve se conectar”.

* Nomes de arquivos e diretórios são escritos assim: “O arquivo global `my.cnf` está localizado no diretório `/etc`.”

* Sequências de caracteres são escritas assim: “Para especificar um caractere curinga, use o caractere `%`.”

Quando comandos ou declarações são prefixados por um prompt, usamos estes:

```
$> type a command here
#> type a command as root here
C:\> type a command here (Windows only)
mysql> type a mysql statement here
```

Os comandos são emitidos no interpretador de comandos. No Unix, este é tipicamente um programa como **sh**, **csh** ou **bash**. No Windows, o programa equivalente é **command.com** ou **cmd.exe**, tipicamente executado em uma janela de console. As declarações prefixadas com `mysql` são emitidas no cliente de linha de comando **mysql**.

Nota

Ao inserir um comando ou declaração mostrada em um exemplo, não digite o prompt mostrado no exemplo.

Em algumas áreas, diferentes sistemas podem ser distinguidos uns dos outros para mostrar que os comandos devem ser executados em dois ambientes diferentes. Por exemplo, ao trabalhar com replicação, os comandos podem ser prefixados com `source` e `replica`:

```
source> type a mysql statement on the replication source here
replica> type a mysql statement on the replica here
```

Os nomes de banco de dados, tabelas e colunas devem ser frequentemente substituídos em declarações. Para indicar que tal substituição é necessária, este manual usa *`db_name`*, *`tbl_name`* e *`col_name`*. Por exemplo, você pode ver uma declaração como esta:

```
mysql> SELECT col_name FROM db_name.tbl_name;
```

Isso significa que, se você inserir uma declaração semelhante, você fornecerá seus próprios nomes de banco de dados, tabela e coluna, talvez assim:

```
mysql> SELECT author_name FROM biblio_db.author_list;
```

As palavras-chave SQL não são case-sensitive e podem ser escritas em qualquer caso. Este manual usa maiúsculas.

Nas descrições de sintaxe, os colchetes (“`[`” e “`]`”) indicam palavras ou cláusulas opcionais. Por exemplo, na seguinte declaração, `IF EXISTS` é opcional:

```
DROP TABLE [IF EXISTS] tbl_name
```

Quando um elemento de sintaxe consiste em várias alternativas, as alternativas são separadas por barras verticais (“`|`”). Quando um membro de um conjunto de escolhas *pode* ser escolhido, as alternativas são listadas dentro de colchetes (“`[`” e “`]`”):

```
TRIM([[BOTH | LEADING | TRAILING] [remstr] FROM] str)
```

Quando um membro de um conjunto de escolhas *deve* ser escolhido, as alternativas são listadas dentro de chaves (“`{`” e “`}`”):

```
{DESCRIBE | DESC} tbl_name [col_name | wild]
```

Uma elipse (`...`) indica a omissão de uma seção de uma declaração, geralmente para fornecer uma versão mais curta de uma sintaxe mais complexa. Por exemplo, `SELECT ... INTO OUTFILE` é uma abreviação da forma da declaração `SELECT` que tem uma cláusula `INTO OUTFILE` após outras partes da declaração.

Uma elipse também pode indicar que o elemento de sintaxe anterior de uma declaração pode ser repetido. No exemplo seguinte, vários valores de `reset_option` podem ser fornecidos, com cada um deles após o primeiro precedido por vírgulas:

```
RESET reset_option [,reset_option] ...
```

Os comandos para definir variáveis de shell são mostrados usando a sintaxe da shell Bourne. Por exemplo, a sequência para definir a variável de ambiente `CC` e executar o comando **configure** parece assim na sintaxe da shell Bourne:

```
$> CC=gcc ./configure
```

Se você estiver usando **csh** ou **tcsh**, você deve emitir comandos de maneira um pouco diferente:

```
$> setenv CC gcc
$> ./configure
```

### Autoria Manual

Os arquivos de fonte do Manual de Referência são escritos no formato DocBook XML. A versão HTML e outros formatos são produzidos automaticamente, principalmente usando as folhas de estilo DocBook XSL. Para informações sobre o DocBook, consulte <http://docbook.org/>

Este manual foi originalmente escrito por David Axmark e Michael “Monty” Widenius. É mantido pela Equipe de Documentação do MySQL, composta por Edward Gilmore, Sudharsana Gomadam, Kim seong Loh, Garima Sharma, Carlos Ortiz, Daniel So e Jon Stephens.