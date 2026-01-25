## 12.3 Conversão de Tipos na Avaliação de Expressões

Quando um operador é usado com operandos de tipos diferentes, ocorre a conversão de tipo para tornar os operandos compatíveis. Algumas conversões ocorrem implicitamente. Por exemplo, o MySQL converte automaticamente strings em números conforme necessário, e vice-versa.

```sql
mysql> SELECT 1+'1';
        -> 2
mysql> SELECT CONCAT(2,' test');
        -> '2 test'
```

Também é possível converter um número para uma string explicitamente usando a função `CAST()`. A conversão ocorre implicitamente com a função `CONCAT()`, pois ela espera argumentos de string.

```sql
mysql> SELECT 38.8, CAST(38.8 AS CHAR);
        -> 38.8, '38.8'
mysql> SELECT 38.8, CONCAT(38.8);
        -> 38.8, '38.8'
```

Consulte mais adiante nesta seção para obter informações sobre o conjunto de caracteres (character set) das conversões implícitas de número para string, e sobre as regras modificadas que se aplicam a comandos `CREATE TABLE ... SELECT`.

As seguintes regras descrevem como a conversão ocorre para operações de comparação:

* Se um ou ambos os argumentos forem `NULL`, o resultado da comparação é `NULL`, exceto para o operador de comparação de igualdade seguro contra `NULL`, `<=>`. Para `NULL <=> NULL`, o resultado é true. Nenhuma conversão é necessária.

* Se ambos os argumentos em uma operação de comparação forem strings, eles são comparados como strings.

* Se ambos os argumentos forem integers, eles são comparados como integers.
* Valores hexadecimais são tratados como binary strings se não forem comparados a um número.

* Se um dos argumentos for uma coluna `TIMESTAMP` ou `DATETIME` e o outro argumento for uma constante, a constante é convertida para um timestamp antes que a comparação seja realizada. Isso é feito para ser mais compatível com ODBC. Isso não é feito para os argumentos de `IN()`. Para garantir a segurança, use sempre strings completas de datetime, date ou time ao fazer comparações. Por exemplo, para obter os melhores resultados ao usar `BETWEEN` com valores de data ou hora, use `CAST()` para converter explicitamente os valores para o tipo de dados desejado.

  Uma subquery de linha única (single-row subquery) de uma ou mais tabelas não é considerada uma constante. Por exemplo, se uma subquery retornar um integer a ser comparado com um valor `DATETIME`, a comparação é feita como dois integers. O integer não é convertido em um valor temporal. Para comparar os operandos como valores `DATETIME`, use `CAST()` para converter explicitamente o valor da subquery para `DATETIME`.

* Se um dos argumentos for um valor decimal, a comparação depende do outro argumento. Os argumentos são comparados como valores decimais se o outro argumento for um valor decimal ou integer, ou como valores floating-point se o outro argumento for um valor floating-point.

* Em todos os outros casos, os argumentos são comparados como números floating-point (precisão dupla). Por exemplo, uma comparação de operandos de string e numéricos ocorre como uma comparação de números floating-point.

Para obter informações sobre a conversão de valores de um tipo temporal para outro, consulte a Seção 11.2.9, “Conversion Between Date and Time Types”.

A comparação de valores JSON ocorre em dois níveis. O primeiro nível de comparação é baseado nos tipos JSON dos valores comparados. Se os tipos diferirem, o resultado da comparação é determinado apenas pelo tipo que tem maior precedência. Se os dois valores tiverem o mesmo tipo JSON, ocorre um segundo nível de comparação usando regras específicas do tipo. Para comparação de valores JSON e não-JSON, o valor não-JSON é convertido para JSON e os valores são comparados como valores JSON. Para detalhes, consulte Comparison and Ordering of JSON Values.

Os seguintes exemplos ilustram a conversão de strings para números em operações de comparação:

```sql
mysql> SELECT 1 > '6x';
        -> 0
mysql> SELECT 7 > '6x';
        -> 1
mysql> SELECT 0 > 'x6';
        -> 0
mysql> SELECT 0 = 'x6';
        -> 1
```

Para comparações de uma coluna de string com um número, o MySQL não pode usar um Index na coluna para buscar o valor rapidamente. Se *`str_col`* for uma coluna de string indexada, o Index não pode ser usado ao realizar a busca no seguinte comando:

```sql
SELECT * FROM tbl_name WHERE str_col=1;
```

A razão para isso é que existem muitas strings diferentes que podem ser convertidas para o valor `1`, como `'1'`, `' 1'`, ou `'1a'`.

Outro problema pode surgir ao comparar uma coluna de string com o integer `0`. Considere a table `t1` criada e populada conforme mostrado aqui:

```sql
mysql> CREATE TABLE t1 (
    ->   c1 INT NOT NULL AUTO_INCREMENT,
    ->   c2 INT DEFAULT NULL,
    ->   c3 VARCHAR(25) DEFAULT NULL,
    ->   PRIMARY KEY (c1)
    -> );
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t1 VALUES ROW(1, 52, 'grape'), ROW(2, 139, 'apple'),
    ->                       ROW(3, 37, 'peach'), ROW(4, 221, 'watermelon'),
    ->                       ROW(5, 83, 'pear');
Query OK, 5 rows affected (0.01 sec)
Records: 5  Duplicates: 0  Warnings: 0
```

Observe o resultado ao selecionar desta table e comparar `c3`, que é uma coluna `VARCHAR`, com o integer `0`:

```sql
mysql> SELECT * FROM t1 WHERE c3 = 0;
+----+------+------------+
| c1 | c2   | c3         |
+----+------+------------+
|  1 |   52 | grape      |
|  2 |  139 | apple      |
|  3 |   37 | peach      |
|  4 |  221 | watermelon |
|  5 |   83 | pear       |
+----+------+------------+
5 rows in set, 5 warnings (0.00 sec)
```

*Isso ocorre mesmo ao usar o modo SQL estrito (strict SQL mode)*. Para evitar que isso aconteça, coloque o valor entre aspas, conforme mostrado aqui:

```sql
mysql> SELECT * FROM t1 WHERE c3 = '0';
Empty set (0.00 sec)
```

Isso *não* ocorre quando o `SELECT` faz parte de um comando de definição de dados, como `CREATE TABLE ... SELECT`; no strict mode, o comando falha devido à comparação inválida:

```sql
mysql> CREATE TABLE t2 SELECT * FROM t1 WHERE c3 = 0;
ERROR 1292 (22007): Truncated incorrect DOUBLE value: 'grape'
```

Quando o `0` é colocado entre aspas, o comando é bem-sucedido, mas a table criada não contém linhas porque não havia nenhuma correspondência com `'0'`, conforme mostrado aqui:

```sql
mysql> CREATE TABLE t2 SELECT * FROM t1 WHERE c3 = '0';
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

Este é um problema conhecido, devido ao fato de que o strict mode não é aplicado ao processar `SELECT`. Consulte também Strict SQL Mode.

Comparações entre números floating-point e grandes valores integer são aproximadas porque o integer é convertido para floating point de precisão dupla antes da comparação, o que não é capaz de representar todos os integers de 64 bits exatamente. Por exemplo, o valor integer 253 + 1 não é representável como um float e é arredondado para 253 ou 253 + 2 antes de uma comparação float, dependendo da plataforma.

Para ilustrar, apenas a primeira das seguintes comparações compara valores iguais, mas ambas as comparações retornam true (1):

```sql
mysql> SELECT '9223372036854775807' = 9223372036854775807;
        -> 1
mysql> SELECT '9223372036854775807' = 9223372036854775806;
        -> 1
```

Quando ocorrem conversões de string para floating-point e de integer para floating-point, elas não ocorrem necessariamente da mesma forma. O integer pode ser convertido para floating-point pela CPU, enquanto a string é convertida dígito por dígito em uma operação que envolve multiplicações floating-point. Além disso, os resultados podem ser afetados por fatores como arquitetura do computador ou versão do compilador ou nível de otimização. Uma maneira de evitar tais problemas é usar `CAST()` para que um valor não seja convertido implicitamente para um número floating-point:

```sql
mysql> SELECT CAST('9223372036854775807' AS UNSIGNED) = 9223372036854775806;
        -> 0
```

Para obter mais informações sobre comparações floating-point, consulte a Seção B.3.4.8, “Problems with Floating-Point Values”.

O servidor inclui `dtoa`, uma biblioteca de conversão que fornece a base para uma conversão aprimorada entre valores de string ou `DECIMAL` - DECIMAL, NUMERIC") e números de valor aproximado (`FLOAT` - FLOAT, DOUBLE")/`DOUBLE` - FLOAT, DOUBLE"))):

* Resultados de conversão consistentes em todas as plataformas, o que elimina, por exemplo, diferenças de conversão entre Unix e Windows.

* Representação precisa de valores em casos em que os resultados anteriores não forneciam precisão suficiente, como para valores próximos aos limites IEEE.

* Conversão de números para o formato string com a melhor precisão possível. A precisão do `dtoa` é sempre a mesma ou melhor do que a das funções da biblioteca C padrão.

Como as conversões produzidas por esta biblioteca diferem em alguns casos dos resultados não-`dtoa`, existe o potencial de incompatibilidades em aplicações que dependem de resultados anteriores. Por exemplo, aplicações que dependem de um resultado exato específico de conversões anteriores podem precisar de ajustes para acomodar precisão adicional.

A biblioteca `dtoa` fornece conversões com as seguintes propriedades. *`D`* representa um valor com uma representação `DECIMAL` - DECIMAL, NUMERIC") ou string, e *`F`* representa um número floating-point em formato binário nativo (IEEE).

* A conversão *`F`* -> *`D`* é feita com a melhor precisão possível, retornando *`D`* como a string mais curta que resulta em *`F`* quando lida novamente e arredondada para o valor mais próximo no formato binário nativo, conforme especificado pelo IEEE.

* A conversão *`D`* -> *`F`* é feita de forma que *`F`* seja o número binário nativo mais próximo da string decimal de entrada *`D`*.

Essas propriedades implicam que as conversões *`F`* -> *`D`* -> *`F`* são lossless (sem perda) a menos que *`F`* seja `-inf`, `+inf`, ou `NaN`. Os últimos valores não são suportados porque o padrão SQL os define como valores inválidos para `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE").

Para conversões *`D`* -> *`F`* -> *`D`*, uma condição suficiente para ser lossless é que *`D`* use 15 ou menos dígitos de precisão, não seja um valor denormal, `-inf`, `+inf`, ou `NaN`. Em alguns casos, a conversão é lossless mesmo que *`D`* tenha mais de 15 dígitos de precisão, mas este nem sempre é o caso.

A conversão implícita de um valor numérico ou temporal para string produz um valor que possui um character set e collation determinados pelas variáveis de sistema `character_set_connection` e `collation_connection`. (Essas variáveis são comumente definidas com `SET NAMES`. Para obter informações sobre connection character sets, consulte a Seção 10.4, “Connection Character Sets and Collations”.)

Isso significa que tal conversão resulta em uma string de caractere (não binária) (um valor `CHAR`, `VARCHAR`, ou `LONGTEXT`), exceto no caso em que o connection character set está definido como `binary`. Nesse caso, o resultado da conversão é uma binary string (um valor `BINARY`, `VARBINARY`, ou `LONGBLOB`).

Para expressões integer, as observações anteriores sobre a *avaliação* de expressões aplicam-se de forma ligeiramente diferente à *atribuição* de expressões; por exemplo, em um comando como este:

```sql
CREATE TABLE t SELECT integer_expr;
```

Neste caso, a coluna da table resultante da expressão tem o tipo `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") dependendo do comprimento da expressão integer. Se o comprimento máximo da expressão não couber em um `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") é usado. O comprimento é retirado do valor `max_length` dos metadados do result set do `SELECT` (consulte C API Basic Data Structures). Isso significa que você pode forçar um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") em vez de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") usando uma expressão suficientemente longa:

```sql
CREATE TABLE t SELECT 000000000000000000000;
```
