## 11.7 Comentários

O MySQL Server suporta três estilos de comentário:

- A partir de um caractere `#` até o final da linha.

- A partir de uma sequência `--` até o final da linha. No MySQL, o estilo de comentário `--` (duas barras) exige que a segunda barra seja seguida por pelo menos um espaço em branco ou caractere de controle, como um espaço ou tabulação. Essa sintaxe difere ligeiramente da sintaxe padrão de comentário do SQL, conforme discutido na Seção 1.6.2.4, “'--' como início de um comentário”.

- De uma sequência `/*` para a sequência `*/` seguinte, como na linguagem de programação C. Essa sintaxe permite que um comentário se estenda por várias linhas, pois o início e o fechamento da sequência não precisam estar na mesma linha.

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

Os comentários aninhados não são suportados e estão desatualizados; espere-os serem removidos em uma futura versão do MySQL. (Em algumas condições, os comentários aninhados podem ser permitidos, mas geralmente não são, e os usuários devem evitá-los.)

O MySQL Server suporta certas variantes de comentários em estilo C. Esses permitem que você escreva código que inclui extensões do MySQL, mas ainda é portátil, usando comentários da seguinte forma:

```
/*! MySQL-specific code */
```

Nesse caso, o MySQL Server analisa e executa o código dentro do comentário como faria com qualquer outra instrução SQL, mas outros servidores SQL devem ignorar as extensões. Por exemplo, o MySQL Server reconhece a palavra-chave `STRAIGHT_JOIN` na seguinte instrução, mas outros servidores não devem:

```
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário será executada apenas se a versão do MySQL for maior ou igual ao número de versão especificado. A palavra-chave `KEY_BLOCK_SIZE` no comentário a seguir será executada apenas por servidores do MySQL 5.1.10 ou superior:

```
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

O número da versão usa o formato `Mmmrr`, onde `M` é uma versão principal, `mm` é uma versão menor de duas dígitos e `rr` é um número de lançamento de duas dígitos. Por exemplo: Em uma declaração que deve ser executada apenas por um servidor MySQL versão 8.0.31 ou posterior, use `80031` no comentário.

O número da versão deve ser seguido por pelo menos um caractere de espaço em branco (ou pelo final do comentário). A partir do MySQL 8.0.34, se essa condição não for atendida, a instrução aciona uma mensagem de aviso. Você deve esperar que essa exigência seja rigorosamente aplicada em uma versão futura do MySQL.

A sintaxe de comentário descrita acima se aplica à forma como o servidor **mysqld** analisa as instruções SQL. O programa cliente **mysql** também realiza algum tipo de análise das instruções antes de enviá-las ao servidor. (Isso é feito para determinar os limites das instruções dentro de uma linha de entrada com várias instruções.) Para obter informações sobre as diferenças entre os analisadores do servidor e do cliente **mysql**, consulte a Seção 6.5.1.6, “Dicas do cliente **mysql**”.

Os comentários no formato `/*!12345 ... */` não são armazenados no servidor. Se este formato for usado para comentar programas armazenados, os comentários não serão mantidos no corpo do programa.

Outra variante da sintaxe de comentário em estilo C é usada para especificar dicas do otimizador. Os comentários de dica incluem um caractere `+` após a sequência de abertura do comentário `/*`. Exemplo:

```
SELECT /*+ BKA(t1) */ FROM ... ;
```

Para obter mais informações, consulte a Seção 10.9.3, “Dicas do otimizador”.

O uso de comandos **mysql** de formato curto, como `\C` dentro de comentários `/* ... */` de várias linhas, não é suportado. Os comandos de formato curto funcionam dentro de comentários de versão de linha única `/*! ... */`, assim como os comentários de `/*+ ... */` de dicas de otimização, que são armazenados nas definições de objetos. Se houver preocupação de que as dicas de otimização possam ser armazenadas em definições de objetos, de modo que os arquivos de dump, ao serem carregados novamente com `mysql`, resultem na execução desses comandos, invocando o **mysql** com a opção `--binary-mode` ou usando um cliente de carregamento diferente do **mysql**.
