## 9.6 Comentários

O MySQL Server suporta três estilos de comentário:

* Do caractere `#` até o final da linha.
* De uma sequência `--` até o final da linha. No MySQL, o estilo de comentário `--` (traço duplo) exige que o segundo traço seja seguido por pelo menos um espaço em branco (*whitespace*) ou caractere de controle, como um espaço ou tabulação. Essa sintaxe difere ligeiramente da sintaxe de comentário SQL padrão, conforme discutido na Seção 1.6.2.4, “'--' as the Start of a Comment”.
* De uma sequência `/*` até a sequência `*/` seguinte, como na linguagem de programação C. Essa sintaxe permite que um comentário se estenda por várias linhas, pois as sequências de início e fechamento não precisam estar na mesma linha.

O exemplo a seguir demonstra todos os três estilos de comentário:

```sql
mysql> SELECT 1+1;     # This comment continues to the end of line
mysql> SELECT 1+1;     -- This comment continues to the end of line
mysql> SELECT 1 /* this is an in-line comment */ + 1;
mysql> SELECT 1+
/*
this is a
multiple-line comment
*/
1;
```

Comentários aninhados (*nested comments*) não são suportados. (Sob algumas condições, comentários aninhados podem ser permitidos, mas geralmente não são, e os usuários devem evitá-los.)

O MySQL Server suporta certas variantes de comentários estilo C (*C-style comments*). Elas permitem que você escreva código que inclua extensões MySQL, mas que ainda seja portátil, usando comentários no seguinte formato:

```sql
/*! MySQL-specific code */
```

Neste caso, o MySQL Server faz o *parse* e executa o código dentro do comentário como faria com qualquer outro *SQL statement*, mas outros servidores SQL ignoram as extensões. Por exemplo, o MySQL Server reconhece a *keyword* `STRAIGHT_JOIN` na seguinte *statement*, mas outros servidores não:

```sql
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário será executada apenas se a versão do MySQL for maior ou igual ao número de versão especificado. A *keyword* `KEY_BLOCK_SIZE` no comentário a seguir é executada apenas por servidores a partir do MySQL 5.1.10 ou superior:

```sql
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

O número de versão usa o formato *`Mmmrr`*, onde *`M`* é uma versão *major*, *`mm`* é uma versão *minor* de dois dígitos e *`rr`* é um número de *release* de dois dígitos. Por exemplo: Em uma *statement* a ser executada apenas por um MySQL Server versão 5.7.31 ou posterior, use `50731` no comentário.

A sintaxe de comentário que acabamos de descrever se aplica à forma como o servidor **mysqld** faz o *parse* das *SQL statements*. O programa *client* **mysql** também executa algum *parsing* das *statements* antes de enviá-las ao servidor. (Ele faz isso para determinar os limites das *statements* dentro de uma linha de entrada com múltiplas *statements*.) Para obter informações sobre as diferenças entre os *parsers* do servidor e do *client* **mysql**, consulte a Seção 4.5.1.6, “mysql Client Tips”.

Comentários no formato `/*!12345 ... */` não são armazenados no servidor. Se este formato for usado para comentar *stored programs*, os comentários não são retidos no corpo do programa.

Outra variante da sintaxe de comentário estilo C é usada para especificar *optimizer hints*. Comentários de *hint* incluem um caractere `+` após a sequência de abertura de comentário `/*`. Exemplo:

```sql
SELECT /*+ BKA(t1) */ FROM ... ;
```

Para mais informações, consulte a Seção 8.9.3, “Optimizer Hints”.

O uso de comandos **mysql** de formato curto, como `\C`, dentro de comentários de múltiplas linhas `/* ... */` não é suportado. Comandos de formato curto funcionam dentro de comentários de versão de linha única `/*! ... */`, assim como em comentários de *optimizer-hint* `/*+ ... */`, que são armazenados em definições de objeto. Se houver a preocupação de que comentários de *optimizer-hint* possam ser armazenados em definições de objeto, de modo que os arquivos de *dump* recarregados com o `mysql` resultem na execução desses comandos, invoque o **mysql** com a opção `--binary-mode` ou use um *client* de recarga diferente do **mysql**.