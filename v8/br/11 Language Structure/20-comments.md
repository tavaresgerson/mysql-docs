## 11.7 Comentários

O MySQL Server suporta três estilos de comentário:

* De um caractere `#` até o final da linha.
* De uma sequência `--` até o final da linha. No MySQL, o estilo de comentário `--` (dupla barra) exige que a segunda barra seja seguida por pelo menos um espaço ou caractere de controle, como um espaço ou tabulação. Essa sintaxe difere ligeiramente da sintaxe padrão de comentário SQL, conforme discutido na Seção 1.7.2.4, “`--' como início de um comentário”.
* De uma sequência `/*` até a sequência `*/` seguinte, como na linguagem de programação C. Essa sintaxe permite que um comentário se estenda por várias linhas porque o início e o final do comentário não precisam estar na mesma linha.

O exemplo a seguir demonstra todos os três estilos de comentário:

```
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

Comentários aninhados não são suportados e são desaconselhados; espera-se que sejam removidos em uma futura versão do MySQL. (Em algumas condições, comentários aninhados podem ser permitidos, mas geralmente não são, e os usuários devem evitá-los.)

O MySQL Server suporta certas variantes de comentários em estilo C. Esses permitem que você escreva código que inclui extensões do MySQL, mas ainda é portátil, usando comentários da seguinte forma:

```
/*! MySQL-specific code */
```

Neste caso, o MySQL Server analisa e executa o código dentro do comentário como faria com qualquer outra declaração SQL, mas outros servidores SQL devem ignorar as extensões. Por exemplo, o MySQL Server reconhece a palavra-chave `STRAIGHT_JOIN` na seguinte declaração, mas outros servidores não devem:

```
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário é executada apenas se a versão do MySQL for maior ou igual ao número de versão especificado. A palavra-chave `KEY_BLOCK_SIZE` no comentário a seguir é executada apenas por servidores a partir do MySQL 5.1.10 ou superior:

```
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

O número da versão usa o formato *`Mmmrr``, onde *`M`* é uma versão principal, *`mm`* é uma versão menor de duas dígitos e *`rr`* é um número de lançamento de dois dígitos. Por exemplo: Em uma declaração que deve ser executada apenas por uma versão do servidor MySQL 8.4.6 ou posterior, use `80406` no comentário.

No MySQL 8.4, o número da versão também pode, opcionalmente, ser composto por seis dígitos no formato *`MMmmrr``, onde *`MM`* é uma versão principal de dois dígitos e *`mm`* e *`rr`* são os números de versão e de lançamento de dois dígitos, respectivamente.

O número da versão deve ser seguido por pelo menos um caractere de espaço em branco (ou o final do comentário). Se o comentário começar com seis dígitos seguidos de espaço em branco, isso é interpretado como um número de versão de seis dígitos. Caso contrário, se começar com pelo menos cinco dígitos, esses são interpretados como um número de versão de cinco dígitos (e quaisquer caracteres restantes são ignorados para esse propósito); se começar com menos de cinco dígitos, o comentário é tratado como um comentário normal do MySQL.

A sintaxe do comentário descrita acima se aplica à forma como o servidor `mysqld` analisa instruções SQL. O programa cliente `mysql` também realiza algum parsing das instruções antes de enviá-las ao servidor. (Ele faz isso para determinar os limites das instruções dentro de uma linha de entrada com várias instruções.) Para informações sobre as diferenças entre os analisadores do servidor e do cliente `mysql`, consulte a Seção 6.5.1.6, “Dicas do Cliente `mysql`”.

Comentários no formato `/*!12345 ... */` não são armazenados no servidor. Se este formato for usado para comentar programas armazenados, os comentários não são retidos no corpo do programa.

Outra variante da sintaxe de comentário em estilo C é usada para especificar dicas do otimizador. Comentários de dica incluem um caractere `+` após a sequência de abertura do comentário `/*`. Exemplo:

```
SELECT /*+ BKA(t1) */ FROM ... ;
```

Para mais informações, consulte a Seção 10.9.3, “Dicas do Otimizador”.

O uso de comandos `mysql` de formato curto, como `\C`, dentro de comentários `/* ... */` de várias linhas não é suportado. Os comandos de formato curto funcionam dentro de comentários de versão `/*! ... */` de uma única linha, assim como os comentários `/*+ ... */` de dicas de otimização, que são armazenados em definições de objetos. Se houver preocupação de que as dicas de otimização possam ser armazenadas em definições de objetos, de modo que os arquivos de dump, ao serem carregados novamente com `mysql`, resultem na execução desses comandos, invocando `mysql` com a opção `--binary-mode` ou usando um cliente de carregamento diferente do `mysql`.