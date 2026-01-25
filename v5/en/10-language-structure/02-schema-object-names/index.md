## 9.2 Nomes de Objetos de Schema

9.2.1 Limites de Comprimento de Identifier

9.2.2 Qualificadores de Identifier

9.2.3 Sensibilidade a Maiúsculas e Minúsculas de Identifier

9.2.4 Mapeamento de Identifiers para Nomes de Arquivo

9.2.5 Análise e Resolução de Nomes de Função

Certos objetos dentro do MySQL, incluindo database, table, index, column, alias, view, stored procedure, partition, tablespace e outros nomes de objetos são conhecidos como *identifiers*. Esta seção descreve a sintaxe permitida para identifiers no MySQL. A Seção 9.2.1, “Limites de Comprimento de Identifier”, indica o comprimento máximo de cada tipo de identifier. A Seção 9.2.3, “Sensibilidade a Maiúsculas e Minúsculas de Identifier”, descreve quais tipos de identifiers são sensíveis a maiúsculas e minúsculas e sob quais condições.

Um identifier pode ser citado (entre aspas) ou não citado. Se um identifier contiver caracteres especiais ou for uma palavra reservada (*reserved word*), você *deve* citá-lo sempre que se referir a ele. (Exceção: Uma palavra reservada que segue um ponto em um nome qualificado deve ser um identifier, então não precisa ser citada.) As palavras reservadas estão listadas na Seção 9.3, “Palavras-Chave e Palavras Reservadas”.

Internamente, os identifiers são convertidos e armazenados como Unicode (UTF-8). Os caracteres Unicode permitidos em identifiers são aqueles do Plano Multilíngue Básico (BMP - Basic Multilingual Plane). Caracteres suplementares não são permitidos. Os identifiers podem, portanto, conter estes caracteres:

* Caracteres permitidos em identifiers não citados:

  + ASCII: [0-9,a-z,A-Z$_] (letras latinas básicas, dígitos 0-9, cifrão, underscore)

  + Estendido: U+0080 .. U+FFFF
* Caracteres permitidos em identifiers citados incluem todo o Plano Multilíngue Básico Unicode (BMP), exceto U+0000:

  + ASCII: U+0001 .. U+007F
  + Estendido: U+0080 .. U+FFFF
* ASCII NUL (U+0000) e caracteres suplementares (U+10000 e superior) não são permitidos em identifiers citados ou não citados.

* Identifiers podem começar com um dígito, mas, a menos que sejam citados, não podem consistir apenas em dígitos.

* Nomes de Database, table e column não podem terminar com caracteres de espaço.

O caractere de citação de identifier é o acento grave (backtick) (`` ` ``):

```sql
mysql> SELECT * FROM `select` WHERE `select`.id > 100;
```

Se o SQL mode `ANSI_QUOTES` estiver habilitado, também é permitido citar identifiers usando aspas duplas:

```sql
mysql> CREATE TABLE "test" (col INT);
ERROR 1064: You have an error in your SQL syntax...
mysql> SET sql_mode='ANSI_QUOTES';
mysql> CREATE TABLE "test" (col INT);
Query OK, 0 rows affected (0.00 sec)
```

O modo `ANSI_QUOTES` faz com que o server interprete strings entre aspas duplas como identifiers. Consequentemente, quando este modo está habilitado, literais de string devem ser delimitados por aspas simples. Eles não podem ser delimitados por aspas duplas. O SQL mode do server é controlado conforme descrito na Seção 5.1.10, “Server SQL Modes”.

Caracteres de citação de identifier podem ser incluídos dentro de um identifier se você citá-lo. Se o caractere a ser incluído dentro do identifier for o mesmo usado para citar o próprio identifier, então você precisa dobrar o caractere. A instrução a seguir cria uma table chamada `` a`b `` que contém uma column chamada `c"d`:

```sql
mysql> CREATE TABLE `a``b` (`c"d` INT);
```

Na lista `SELECT` de uma Query, um alias de column citado pode ser especificado usando caracteres de citação de identifier ou de string:

```sql
mysql> SELECT 1 AS `one`, 2 AS 'two';
+-----+-----+
| one | two |
+-----+-----+
|   1 |   2 |
+-----+-----+
```

Em outras partes da instrução, referências citadas ao alias devem usar citação de identifier ou a referência será tratada como um literal de string.

Recomenda-se que você não use nomes que comecem com `Me` ou `MeN`, onde *`M`* e *`N`* são inteiros. Por exemplo, evite usar `1e` como um identifier, pois uma expressão como `1e+3` é ambígua. Dependendo do contexto, ela pode ser interpretada como a expressão `1e + 3` ou como o número `1e+3`.

Tenha cuidado ao usar `MD5()` para produzir nomes de table, pois ele pode gerar nomes em formatos ilegais ou ambíguos, como os descritos acima.

Uma variável de usuário não pode ser usada diretamente em uma instrução SQL como um identifier ou como parte de um identifier. Consulte a Seção 9.4, “Variáveis Definidas pelo Usuário”, para mais informações e exemplos de soluções alternativas (workarounds).

Caracteres especiais em nomes de database e table são codificados nos nomes de sistema de arquivos correspondentes conforme descrito na Seção 9.2.4, “Mapeamento de Identifiers para Nomes de Arquivo”. Se você tiver databases ou tables de uma versão anterior do MySQL que contenham caracteres especiais e cujos nomes de diretório ou nomes de arquivo subjacentes não tenham sido atualizados para usar a nova codificação, o server exibirá seus nomes com o prefixo `#mysql50#`. Para obter informações sobre como se referir a esses nomes ou convertê-los para a codificação mais recente, consulte essa seção.