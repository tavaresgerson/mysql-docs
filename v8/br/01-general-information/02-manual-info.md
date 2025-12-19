## 1.1 Sobre este manual

Este é o Manual de Referência para o Sistema de Base de Dados MySQL, versão 8.4, até a versão 8.4.6. Diferenças entre versões menores do MySQL 8.4 são observadas no presente texto com referência aos números de versão (8.4.`x`). Para informações sobre licenças, consulte o Notificativos Legais.

Este manual não se destina a ser usado com versões mais antigas do software MySQL devido às muitas diferenças funcionais e outras entre o MySQL 8.4 e versões anteriores. Se você estiver usando uma versão anterior do software MySQL, consulte o manual apropriado. Por exemplo, o Manual de Referência do MySQL 8.0 cobre a série de correções de bugs 8.0 dos lançamentos do MySQL.

Como este manual serve de referência, não fornecemos instruções gerais sobre conceitos de SQL ou de bases de dados relacionais, nem ensina como usar o seu sistema operativo ou o intérprete de linha de comando.

O software de banco de dados MySQL está em constante desenvolvimento, e o Manual de Referência é atualizado com freqüência também. A versão mais recente do manual está disponível online em formato pesquisável em [<https://dev.mysql.com/doc/>](https://dev.mysql.com/doc/). Outros formatos também estão disponíveis lá, incluindo versões HTML e PDF para download.

O código-fonte do MySQL contém documentação interna escrita usando o Doxygen. O conteúdo do Doxygen gerado está disponível em [<https://dev.mysql.com/doc/index-other.html>](https://dev.mysql.com/doc/index-other.html).

Se você tiver dúvidas sobre o uso do MySQL, junte-se ao [MySQL Community Slack](https://mysqlcommunity.slack.com/). Se você tiver sugestões sobre adições ou correções ao próprio manual, por favor envie-as para o [<http://www.mysql.com/company/contact/>](http://www.mysql.com/company/contact/).

### Convenções tipográficas e de sintaxe

Este manual utiliza certas convenções tipográficas:

- `Text in this style` é usado para instruções SQL; bancos de dados, tabelas e nomes de colunas; listagens de programas e código fonte; e variáveis de ambiente. Exemplo: "Para recarregar as tabelas de concessão, use a instrução `FLUSH PRIVILEGES`."
- `Text in this style` indica a entrada que você digita em exemplos.
- **Texto neste estilo** indica os nomes de programas e scripts executáveis, sendo exemplos **mysql** (o programa cliente de linha de comando MySQL) e **mysqld** (o executável do servidor MySQL).
- `Text in this style` é usado para entrada de variável para a qual você deve substituir um valor de sua própria escolha.
- O texto deste estilo é usado para dar ênfase.
- ** O texto deste estilo** é usado nos títulos das tabelas e para transmitir uma ênfase especialmente forte.
- `Text in this style` é usado para indicar uma opção de programa que afeta a forma como o programa é executado, ou que fornece informações necessárias para que o programa funcione de uma certa maneira. *Exemplo*: "A opção `--host` (abreviatura `-h`) informa ao programa cliente **mysql** o nome de host ou endereço IP do servidor MySQL ao qual deve se conectar.
- Nomes de arquivos e diretórios são escritos assim: "O arquivo global `my.cnf` está localizado no diretório `/etc`."
- Sequências de caracteres são escritas assim: "Para especificar um wildcard, use o caractere "`%`"."

Quando comandos ou instruções são prefixados por um prompt, usamos estes:

```
$> type a command here
#> type a command as root here
C:> type a command here (Windows only)
mysql> type a mysql statement here
```

Os comandos são emitidos em seu interpretador de comandos. Em Unix, este é tipicamente um programa como ** sh **, ** csh **, ou ** bash **. No Windows, o programa equivalente é ** command.com ** ou ** cmd.exe **, normalmente executado em uma janela de console.

::: info Nota
Quando introduzir um comando ou instrução mostrado num exemplo, não digite o prompt mostrado no exemplo.
:::

Em algumas áreas, diferentes sistemas podem ser distinguidos um do outro para mostrar que os comandos devem ser executados em dois ambientes diferentes. Por exemplo, ao trabalhar com replicação, os comandos podem ser prefixados com `source` e `replica`:

```bash
source> type a mysql statement on the replication source here
replica> type a mysql statement on the replica here
```

Para indicar que tal substituição é necessária, este manual usa `db_name`, `tbl_name`, e `col_name`. Por exemplo, você pode ver uma instrução como esta:

```sql
mysql> SELECT col_name FROM db_name.tbl_name;
```

Isso significa que, se você fosse inserir uma instrução semelhante, você forneceria seus próprios nomes de banco de dados, tabelas e colunas, talvez assim:

```sql
mysql> SELECT author_name FROM biblio_db.author_list;
```

As palavras-chave SQL não são sensíveis a maiúsculas e minúsculas e podem ser escritas em qualquer letra.

Nas descrições de sintaxe, parênteses quadrados ("`[`" e "`]`") indicam palavras ou cláusulas opcionais. Por exemplo, na seguinte afirmação, `IF EXISTS` é opcional:

```sql
DROP TABLE [IF EXISTS] tbl_name
```

Quando um elemento de sintaxe consiste em várias alternativas, as alternativas são separadas por barras verticais ("`|`"). Quando um membro de um conjunto de escolhas *pode* ser escolhido, as alternativas são listadas entre parênteses quadrados ("`[`" e "`]`"):

```sql
TRIM([[BOTH | LEADING | TRAILING] [remstr] FROM] str)
```

Quando um membro de um conjunto de opções *deve* ser escolhido, as alternativas são listadas entre parênteses ("`{`" e "`}`"):

```sql
{DESCRIBE | DESC} tbl_name [col_name | wild]
```

Uma elipse (`...`) indica a omissão de uma seção de uma instrução, tipicamente para fornecer uma versão mais curta de uma sintaxe mais complexa. Por exemplo, `SELECT ... INTO OUTFILE` é uma abreviação para a forma de `SELECT` instrução que tem uma cláusula `INTO OUTFILE` seguindo outras partes da instrução.

Uma elípse também pode indicar que o elemento de sintaxe anterior de uma instrução pode ser repetido. No exemplo a seguir, múltiplos valores *`reset_option`* podem ser dados, com cada um deles após o primeiro precedido por vírgulas:

```
RESET reset_option [,reset_option] ...
```

Os comandos para definir variáveis de shell são mostrados usando a sintaxe do shell Bourne. Por exemplo, a sequência para definir a variável de ambiente `CC` e executar o comando **configure** parece assim na sintaxe do shell Bourne:

```
$> CC=gcc ./configure
```

Se você estiver usando **csh** ou **tcsh**, você deve emitir comandos de forma um pouco diferente:

```bash
$> setenv CC gcc
$> ./configure
```

### Autoria do manual

Os arquivos de origem do Manual de Referência são escritos no formato DocBook XML. A versão HTML e outros formatos são produzidos automaticamente, principalmente usando as folhas de estilo DocBook XSL.

Este manual foi originalmente escrito por David Axmark e Michael "Monty" Widenius. É mantido pela Equipe de Documentação do MySQL, composta por Edward Gilmore, Sudharsana Gomadam, Kim seong Loh, Garima Sharma, Carlos Ortiz, Daniel So e Jon Stephens.
