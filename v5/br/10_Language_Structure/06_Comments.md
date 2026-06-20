## 9.6 Comentários

O MySQL Server suporta três estilos de comentário:

* De um caractere `#` até o final da string.
* De uma sequência `--` até o final da string. No MySQL, o estilo de comentário `--` (duas barras) exige que a segunda barra seja seguida por pelo menos um caractere de espaço ou controle, como um espaço ou uma tabulação. Essa sintaxe difere ligeiramente da sintaxe padrão de comentário SQL, conforme discutido na Seção 1.6.2.4, “'--' como o início de um comentário”.

* De uma sequência `/*` para a sequência `*/` a seguir, como na linguagem de programação C. Essa sintaxe permite que um comentário se estenda em várias strings, pois o início e o fechamento das sequências não precisam estar na mesma string.

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

Comentários aninhados não são suportados. (Em algumas condições, comentários aninhados podem ser permitidos, mas geralmente não são, e os usuários devem evitá-los.)

O MySQL Server suporta certas variantes de comentários em estilo C. Isso permite que você escreva código que inclui extensões do MySQL, mas que ainda é portátil, usando comentários da seguinte forma:

```sql
/*! MySQL-specific code */
```

Neste caso, o MySQL Server analisa e executa o código dentro do comentário como faria com qualquer outra declaração SQL, mas outros servidores SQL ignoram as extensões. Por exemplo, o MySQL Server reconhece a palavra-chave `STRAIGHT_JOIN` na seguinte declaração, mas outros servidores não:

```sql
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário é executada apenas se a versão do MySQL for maior ou igual ao número de versão especificado. A palavra-chave `KEY_BLOCK_SIZE` no comentário a seguir é executada apenas por servidores do MySQL 5.1.10 ou superior:

```sql
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

O número da versão usa o formato *`Mmmrr`*, onde *`M`* é uma versão principal, *`mm`* é uma versão menor de duas dígitos e *`rr`* é um número de lançamento de duas dígitos. Por exemplo: Em uma declaração que deve ser executada apenas por uma versão do servidor MySQL 5.7.31 ou posterior, use `50731` no comentário.

A sintaxe de comentário que acabou de ser descrita se aplica à forma como o servidor `mysqld` analisa as declarações SQL. O programa cliente **mysql** também realiza algum tipo de análise de declarações antes de enviá-las ao servidor. (Isso é feito para determinar os limites das declarações dentro de uma string de entrada com várias declarações.) Para informações sobre as diferenças entre os analisadores do servidor e do cliente **mysql**, consulte a Seção 4.5.1.6, “Dicas do cliente **mysql” (em inglês).

Comentários no formato `/*!12345 ... */` não são armazenados no servidor. Se este formato for usado para comentar programas armazenados, os comentários não serão retidos no corpo do programa.

Outra variante da sintaxe de comentário em estilo C é usada para especificar dicas do otimizador. Os comentários de dica incluem um caractere `+` após a sequência de abertura do comentário `/*`. Exemplo:

```sql
SELECT /*+ BKA(t1) */ FROM ... ;
```

Para mais informações, consulte a Seção 8.9.3, “Dicas do otimizador”.

O uso de comandos de formato curto, como `\C` em comentários de várias strings `/* ... */` não é suportado. Os comandos de formato curto funcionam em comentários de versão de string única `/*! ... */`, assim como os comentários de dicas de otimização `/*+ ... */`, que são armazenados em definições de objeto. Se houver preocupação de que as dicas de otimização possam ser armazenadas em definições de objeto de modo que os arquivos de dump, quando re carregados com `mysql`, resultem na execução desses comandos, invocando o **mysql** com a opção `--binary-mode` ou usando um cliente de re carregamento diferente do **mysql**.